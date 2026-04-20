import jwt, { type SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { config } from '@config/env.config';
import type {
  TokenPayload,
  RefreshTokenPayload,
  AuthTokens,
} from '@validation/auth.types';

const baseOptions = {
  issuer: 'tu-app-name',
  audience: 'tu-app-client',
} as const;

export function createTokenPair(
  payload: TokenPayload,
  refreshPayload: RefreshTokenPayload,
): AuthTokens {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(refreshPayload),
  };
}

//TODO: Change issuer and audience
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

//TODO: Change issuer and audience
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, config.jwtRefreshSecret, {
      issuer: 'tu-app-name',
      audience: 'tu-app-client',
    }) as Partial<RefreshTokenPayload>;

    if (typeof decoded.remember !== 'boolean') {
      throw new Error('INVALID_REFRESH_PAYLOAD');
    }

    return decoded as RefreshTokenPayload;
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

export function parseExpiration(exp: string): Date {
  const match = exp.match(/(\d+)([smhd])/);

  if (!match) {
    console.error('[parseExpirationToDate] invalid format:', exp);
    throw new Error('Invalid expiration format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<'s' | 'm' | 'h' | 'd', number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const ms = value * multipliers[unit as 's' | 'm' | 'h' | 'd'];

  const expiresAt = new Date(Date.now() + ms);

  return expiresAt;
}

function generateAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    ...baseOptions,
    expiresIn: config.jwtAccessExpiration as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.jwtAccessSecret, options);
}

function generateRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = {
    ...baseOptions,
    expiresIn: config.jwtRefreshExpiration as SignOptions['expiresIn'],
  };

  return jwt.sign(
    {
      ...payload,
      jti: randomUUID(),
    },
    config.jwtRefreshSecret,
    options,
  );
}
