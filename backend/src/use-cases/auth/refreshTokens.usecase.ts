import { Types } from 'mongoose';
import { config } from '@config/env.config';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';
import type { AuthTokens, TokenPayload } from '@/types/auth.types';
import {
  verifyRefreshToken,
  createTokenPair,
  parseExpiration,
} from '@utils/jwt.utils';

export const refreshAccessToken = async (
  tokenRepository: RefreshTokenRepository,
  refreshToken: string,
): Promise<AuthTokens> => {
  const payload = verifyRefreshToken(refreshToken);

  const storedToken = await tokenRepository.findRefreshToken(refreshToken);

  if (!storedToken) {
    await tokenRepository.revokeAllUserTokens(payload.userId);
    throw new Error('REFRESH_TOKEN_REVOKED');
  }

  await tokenRepository.revokeRefreshToken(refreshToken);

  const newTokenPayload: TokenPayload = {
    userId: payload.userId,
    email: payload.email,
    roleId: payload.roleId,
  };

  const newTokens = createTokenPair(newTokenPayload);

  await tokenRepository.storeRefreshToken({
    _id: new Types.ObjectId(),
    token: newTokens.refreshToken,
    userId: payload.userId,
    expiresAt: parseExpiration(config.jwtRefreshExpiration),
    createdAt: new Date(),
    revoked: false,
  });

  return newTokens;
};
