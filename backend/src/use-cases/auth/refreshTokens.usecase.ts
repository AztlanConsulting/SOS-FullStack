import { Types } from 'mongoose';
import { config } from '@config/env.config';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';
import type { AuthTokens, TokenPayload } from '@/types/auth.types';
import {
  verifyRefreshToken,
  createTokenPair,
  parseExpiration,
} from '@utils/jwt.utils';

/**
 * Refreshes an access token using a valid refresh token.
 * Implements refresh token rotation (old token is invalidated, new pair is issued).
 *
 * @param tokenRepository - Refresh token persistence layer
 * @param refreshToken - Raw refresh token provided by the client
 * @return New access + refresh token pair
 */
export const refreshAccessToken = async (
  tokenRepository: RefreshTokenRepository,
  refreshToken: string,
): Promise<AuthTokens> => {
  const payload = verifyRefreshToken(refreshToken);

  const storedToken = await tokenRepository.findRefreshToken(refreshToken);

  if (!storedToken) {
    // If token is not found, assume potential token theft or reuse attack
    // Revoke all user sessions as a security precaution
    await tokenRepository.revokeAllUserTokens(payload.userId);
    throw new Error('REFRESH_TOKEN_REVOKED');
  }

  // Rotate refresh token: invalidate current one before issuing a new pair
  await tokenRepository.revokeRefreshToken(refreshToken);

  const newTokenPayload: TokenPayload = {
    userId: payload.userId,
    email: payload.email,
    roleId: payload.roleId,
  };

  const newTokens = createTokenPair(newTokenPayload);

  // Persist new refresh token for future validation
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
