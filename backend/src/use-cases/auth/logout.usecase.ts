import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';

export const logoutUser = async (
  tokenRepository: RefreshTokenRepository,
  refreshToken: string,
): Promise<void> => {
  const storedToken = await tokenRepository.findRefreshToken(refreshToken);

  if (storedToken) {
    await tokenRepository.revokeRefreshToken(refreshToken);
  }
};
