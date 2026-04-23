import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';

/**
 * Logs out a user by revoking their refresh token (if it exists).
 * This effectively invalidates the session associated with that token.
 *
 * @param tokenRepository - Refresh token persistence layer
 * @param refreshToken - Raw refresh token to be revoked
 * @return Resolves when the logout process completes
 */
export const logoutUser = async (
  tokenRepository: RefreshTokenRepository,
  refreshToken: string,
): Promise<void> => {
  const storedToken = await tokenRepository.findRefreshToken(refreshToken);

  if (storedToken) {
    await tokenRepository.revokeRefreshToken(refreshToken);
  }
};
