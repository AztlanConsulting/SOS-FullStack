import { logoutUser } from '@use-cases/auth/logout.usecase';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';

describe('logoutUser use-case (unit)', () => {
  test('revokes token if exists', async () => {
    // Mock refresh token repository with existing token
    const repo: Partial<RefreshTokenRepository> = {
      findRefreshToken: jest.fn().mockResolvedValue({ token: 'abc' }),
      revokeRefreshToken: jest.fn(),
    };

    await logoutUser(repo as RefreshTokenRepository, 'abc');

    // Verify token lookup
    expect(repo.findRefreshToken).toHaveBeenCalledWith('abc');

    // Verify token revocation
    expect(repo.revokeRefreshToken).toHaveBeenCalledWith('abc');
  });

  test('does nothing if token does not exist', async () => {
    // Mock repository returning no token
    const repo: Partial<RefreshTokenRepository> = {
      findRefreshToken: jest.fn().mockResolvedValue(null),
      revokeRefreshToken: jest.fn(),
    };

    await logoutUser(repo as RefreshTokenRepository, 'abc');

    // Ensure revoke is not called when token doesn't exist
    expect(repo.revokeRefreshToken).not.toHaveBeenCalled();
  });
});
