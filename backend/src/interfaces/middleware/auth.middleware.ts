import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@utils/jwt.utils';
import { getUserById } from '@use-cases/auth/getUser.usecase';
import { getUserPermissions } from '@/use-cases/auth/getUserPermissions.usecase';
import { userDataAccess } from '@interfaces/data-access/user.data-access';
import type { TokenPayload } from '@validation/auth.types';

// Extend Express Request to include authenticated user payload
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication middleware that validates JWT access tokens.
 * Attaches decoded user payload to request object.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  // Ensure Authorization header exists and follows Bearer scheme
  if (authHeader == null || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token de autenticacion requerido',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Defensive check for malformed headers
  if (!token) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Formato de token invalido',
    });
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    // Validate that user still exists and is active in DB
    const user = await getUserById(userDataAccess, payload.userId.toString());

    if (user === null || user === undefined || !user.active) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Usuario no valido o desactivado',
      });
      return;
    }

    // Attach user identity to request context for downstream usage
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof Error && error.message === 'TOKEN_EXPIRED') {
      res.status(401).json({
        error: 'TOKEN_EXPIRED',
        message:
          'El token ha expirado. Usa tu refresh token para obtener uno nuevo.',
      });
      return;
    }

    // Generic invalid token fallback (tampered, malformed, etc.)
    res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Token invalido o manipulado',
    });
  }
};

/**
 * Authorization middleware factory.
 * Checks whether authenticated user has permission for a given resource/action.
 *
 * @param resource - Resource name (e.g. 'users', 'plans')
 * @param action - CRUD action to authorize
 */
export const requirePermission = (
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete',
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Autenticación requerida',
        });
      }

      // Resolve full permission map for user (role + overrides)
      const permissions = await getUserPermissions(
        userDataAccess,
        req.user.userId.toString(),
      );

      // Check if user has required permission for resource/action
      const hasPermission = permissions[resource]?.[action] === true;

      if (!hasPermission) {
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: 'No tienes permisos para esta acción',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        error: 'SERVER_ERROR',
        message: 'Error validando permisos',
      });
    }
  };
};
