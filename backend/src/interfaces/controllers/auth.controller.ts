import type { Request, Response } from 'express';
import { loginUser } from '@use-cases/auth/login.usecase';
import { refreshAccessToken } from '@use-cases/auth/refreshTokens.usecase';
import { userDataAccess } from '@interfaces/data-access/user.data-access';
import { refreshTokenDataAccess } from '../data-access/refreshToken.data-acces';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

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
    });

    //TODO: Change to production
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    res.status(200).json({
      user: result.user,
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      res
        .status(401)
        .json({ error: 'UNAUTHORIZED', message: 'Credenciales invalidas' });
      return;
    }
    res
      .status(500)
      .json({ error: 'INTERNAL_ERROR', message: 'Error al iniciar sesion' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    console.log(req.cookies);
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

    //TODO: Change to production
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    res.status(200).json({
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'REFRESH_TOKEN_REVOKED') {
        res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
        res.status(401).json({
          error: 'TOKEN_REVOKED',
          message: 'Sesion invalidada. Inicia sesion nuevamente.',
        });
        return;
      }
    }
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res
      .status(401)
      .json({ error: 'UNAUTHORIZED', message: 'Refresh token invalido' });
  }
};

export default {
  login,
  refresh,
};
