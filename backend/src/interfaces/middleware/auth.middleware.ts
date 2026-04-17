import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@utils/jwt.utils';
import { getUserById } from '@use-cases/auth/getUser.usecase';
import { userDataAccess } from '@interfaces/data-access/user.data-access';
import type { TokenPayload } from '@validation/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader == null || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token de autenticacion requerido',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Formato de token invalido',
    });
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await getUserById(userDataAccess, payload.userId.toString());

    if (user === null || user === undefined || !user.active) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Usuario no valido o desactivado',
      });
      return;
    }

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

    res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Token invalido o manipulado',
    });
  }
};
