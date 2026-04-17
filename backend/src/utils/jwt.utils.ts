import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '@config/env.config';
import type { TokenPayload, AuthTokens } from '@validation/auth.types';

const baseOptions = {
  issuer: 'tu-app-name',
  audience: 'tu-app-client',
} as const;

export function createTokenPair(payload: TokenPayload): AuthTokens {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret, {
      issuer: 'tu-app-name',
      audience: 'tu-app-client',
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('TOKEN_INVALID');
    }
    throw new Error('TOKEN_VERIFICATION_FAILED');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, config.jwtRefreshSecret, {
      issuer: 'tu-app-name',
      audience: 'tu-app-client',
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('REFRESH_TOKEN_INVALID');
    }
    throw new Error('REFRESH_TOKEN_VERIFICATION_FAILED');
  }
}

function generateAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    ...baseOptions,
    expiresIn: config.jwtAccessExpiration as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.jwtAccessSecret, options);
}

function generateRefreshToken(payload: TokenPayload): string {
  const options: SignOptions = {
    ...baseOptions,
    expiresIn: config.jwtRefreshExpiration as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.jwtRefreshSecret, options);
}
