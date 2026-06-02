import type { CookieOptions, Request, Response } from 'express';
import { loginUser } from '@use-cases/auth/login.usecase';
import { refreshAccessToken } from '@use-cases/auth/refreshTokens.usecase';
import { logoutUser } from '@/use-cases/auth/logout.usecase';
import { requestPasswordReset } from '@use-cases/auth/requestPasswordReset.usecase';
import { validateResetToken } from '@use-cases/auth/validateResetToken.usecase';
import { resetPassword as resetPasswordUseCase } from '@use-cases/auth/resetPassword.usecase';
import { userDataAccess } from '@infrastructure/data-access/user.data-access';
import { refreshTokenDataAccess } from '@infrastructure/data-access/refreshToken.data-acces';
import { passwordResetTokenDataAccess } from '@infrastructure/data-access/passwordResetToken.data-access';
import { emailService } from '@infrastructure/service/email.service';
import { verifyRefreshToken } from '@utils/jwt.utils';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minPasswordLength = 8;

/**
 * Authenticates user credentials and issues JWT tokens.
 * Sets refresh token as HTTP-only cookie.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body ?? {};

    if (!Boolean(email) || !Boolean(password)) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Email y contrasena son requeridos',
      });
      return;
    }

    const result = await loginUser(userDataAccess, refreshTokenDataAccess, {
      email,
      password,
      remember,
    });

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.ENV === 'production',
      sameSite: 'lax',
      path: `${process.env.ENV === 'production' ? '/api' : ''}/auth/refresh`,
    };

    if (Boolean(remember)) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
    }

    res.cookie('refreshToken', result.tokens.refreshToken, cookieOptions);
    res.status(200).json({
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'INVALID_CREDENTIALS':
          res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'Credenciales inválidas',
          });
          return;

        case 'USER_DEACTIVATED':
          res.status(403).json({
            error: 'FORBIDDEN',
            message: 'USER_DISABLED',
          });
          return;
      }
    }

    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error al iniciar sesión',
    });
  }
};

/**
 * Issues a new access token using refresh token rotation.
 * If refresh token is invalid or revoked, session is invalidated.
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken: string | undefined = req.cookies?.refreshToken;

    if (refreshToken == null) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Refresh token no proporcionado',
      });
      return;
    }

    const tokens = await refreshAccessToken(
      refreshTokenDataAccess,
      refreshToken,
    );

    const decoded = verifyRefreshToken(refreshToken);

    // Refresh token rotation (new cookie replaces old one)
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.ENV === 'production',
      sameSite: 'lax',
      path: `${process.env.ENV === 'production' ? '/api' : ''}/auth/refresh`,
    };

    if (decoded.remember) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
    }

    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    res.status(200).json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'REFRESH_TOKEN_REVOKED') {
        res.clearCookie('refreshToken', {
          path: `${process.env.ENV === 'production' ? '/api' : ''}/auth/refresh`,
        });
        res.status(401).json({
          error: 'TOKEN_REVOKED',
          message: 'Sesion invalidada. Inicia sesion nuevamente.',
        });
        return;
      }
    }
    // Generic invalid token fallback
    res.clearCookie('refreshToken', {
      path: `${process.env.ENV === 'production' ? '/api' : ''}/auth/refresh`,
    });
    res
      .status(401)
      .json({ error: 'UNAUTHORIZED', message: 'Refresh token invalido' });
  }
};

/**
 * Logs out user by revoking refresh token (if present)
 * and clearing authentication cookie.
 */
export const logout = async (req: Request, res: Response) => {
  const refreshToken: string | undefined = req.cookies?.refreshToken;

  if (refreshToken != null) {
    await logoutUser(refreshTokenDataAccess, refreshToken);
  }

  // Clear cookie regardless of DB state
  res.clearCookie('refreshToken', {
    path: `${process.env.ENV === 'production' ? '/api' : ''}/auth/refresh`,
  });
  res.status(200).json({ message: 'Sesion cerrada correctamente' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body ?? {};

    if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Correo invalido',
      });
      return;
    }

    const result = await requestPasswordReset(
      {
        userRepository: userDataAccess,
        passwordResetTokenRepository: passwordResetTokenDataAccess,
      },
      emailService,
      email,
    );

    if (result.status === 'RESET_LINK_ALREADY_ACTIVE') {
      res.status(200).json({
        message:
          'Ya existe un enlace vigente. Revisa tu correo o espera 24 horas.',
        expiresAt: result.expiresAt,
      });
      return;
    }

    if (result.status === 'EMAIL_SENT') {
      res.status(200).json({
        message: 'Se enviaron instrucciones para recuperar la contrasena.',
        expiresAt: result.expiresAt,
      });
      return;
    }

    res.status(200).json({
      message:
        'Si el correo existe, se enviaran instrucciones para recuperar la contrasena.',
    });
  } catch (_error) {
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error al solicitar recuperacion de contrasena',
    });
  }
};

export const validateResetPasswordToken = async (
  req: Request,
  res: Response,
) => {
  try {
    const token = req.query.token;

    if (typeof token !== 'string' || token.trim() === '') {
      res.status(400).json({
        valid: false,
        message: 'Link invalido o expirado',
      });
      return;
    }

    const isValid = await validateResetToken(
      passwordResetTokenDataAccess,
      token,
    );

    if (!isValid) {
      res.status(400).json({
        valid: false,
        message: 'Link invalido o expirado',
      });
      return;
    }

    res.status(200).json({ valid: true });
  } catch (_error) {
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error al validar link de recuperacion',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword, confirmPassword } = req.body ?? {};

    if (
      typeof token !== 'string' ||
      token.trim() === '' ||
      typeof newPassword !== 'string' ||
      typeof confirmPassword !== 'string'
    ) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Datos incompletos',
      });
      return;
    }

    if (newPassword.length < minPasswordLength) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: `La contrasena debe tener al menos ${minPasswordLength} caracteres`,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Las contrasenas no coinciden',
      });
      return;
    }

    await resetPasswordUseCase(
      {
        userRepository: userDataAccess,
        refreshTokenRepository: refreshTokenDataAccess,
        passwordResetTokenRepository: passwordResetTokenDataAccess,
      },
      {
        token,
        newPassword,
      },
    );

    res.status(200).json({
      message: 'Contrasena actualizada correctamente',
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'RESET_TOKEN_INVALID' ||
        error.message === 'USER_NOT_AVAILABLE'
      ) {
        res.status(400).json({
          error: 'RESET_TOKEN_INVALID',
          message: 'Link invalido o expirado',
        });
        return;
      }
    }

    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Error al actualizar contrasena',
    });
  }
};

export const me = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Usuario no autenticado',
    });
    return;
  }
  res.status(200).json({
    user: req.user,
  });
};

export default {
  login,
  refresh,
  logout,
  forgotPassword,
  validateResetPasswordToken,
  resetPassword,
  me,
};
