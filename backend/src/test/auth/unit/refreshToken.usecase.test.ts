import { refreshAccessToken } from '@use-cases/auth/refreshTokens.usecase';
import { verifyRefreshToken, createTokenPair } from '@utils/jwt.utils';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';

jest.mock('@utils/jwt.utils', () => ({
  verifyRefreshToken: jest.fn(),
  createTokenPair: jest.fn(),
  parseExpiration: jest.fn(),
}));

jest.mock('@use-cases/auth/getUser.usecase', () => ({
  getUserById: jest.fn().mockResolvedValue({ active: true }),
}));

describe('refreshAccessToken use-case (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rotates token correctly', async () => {
    // Mock decoded refresh token payload
    (verifyRefreshToken as jest.Mock).mockReturnValue({
      userId: 'user-id',
      email: 'test@test.com',
      role: 'admin',
      remember: true,
    });

    // Mock generated token pair
    (createTokenPair as jest.Mock).mockReturnValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });

    // Mock refresh token repository
    const repo: Partial<RefreshTokenRepository> = {
      findRefreshToken: jest.fn().mockResolvedValue({ token: 'abc' }),
      revokeRefreshToken: jest.fn(),
      storeRefreshToken: jest.fn(),
    };

    const result = await refreshAccessToken(
      repo as RefreshTokenRepository,
      'valid-token',
    );

    // Verify token lookup
    expect(repo.findRefreshToken).toHaveBeenCalledWith('valid-token');

    // Verify token revocation
    expect(repo.revokeRefreshToken).toHaveBeenCalledWith('valid-token');

    // Verify new token storage
    expect(repo.storeRefreshToken).toHaveBeenCalled();

    // Verify returned tokens
    expect(result).toEqual({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
  });

  test('throws if token not found (possible attack)', async () => {
    // Mock decoded refresh token payload
    (verifyRefreshToken as jest.Mock).mockReturnValue({
      userId: 'user-id',
      email: 'test@test.com',
      role: 'admin',
      remember: true,
    });

    // Mock repository returning missing token
    const repo: Partial<RefreshTokenRepository> = {
      findRefreshToken: jest.fn().mockResolvedValue(null),
      revokeAllUserTokens: jest.fn(),
    };

    // Expect token reuse/revocation error
    await expect(
      refreshAccessToken(repo as RefreshTokenRepository, 'bad-token'),
    ).rejects.toThrow('REFRESH_TOKEN_REVOKED');

    // Ensure all user tokens were revoked
    expect(repo.revokeAllUserTokens).toHaveBeenCalled();
  });
});
