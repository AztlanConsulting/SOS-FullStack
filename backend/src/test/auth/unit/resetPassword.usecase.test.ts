import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';
import type { UserRepository } from '@domain/repositories/user.repository';
import { resetPassword } from '@use-cases/auth/resetPassword.usecase';
import { hashPasswordResetToken } from '@utils/passwordResetToken.utils';

jest.mock('bcryptjs');

describe('resetPassword use-case (unit)', () => {
  const userId = new Types.ObjectId();
  const rawToken = 'raw-reset-token';
  const tokenHash = hashPasswordResetToken(rawToken);
  const tokenRecord = {
    _id: new Types.ObjectId(),
    userId,
    email: 'user@test.com',
    tokenHash,
    expiresAt: new Date(Date.now() + 60_000),
    usedAt: null,
    createdAt: new Date(),
  };
  const activeUser = {
    _id: userId,
    email: 'user@test.com',
    active: true,
  };

  const buildRepositories = (
    overrides: Partial<{
      userRepository: Partial<UserRepository>;
      refreshTokenRepository: Partial<RefreshTokenRepository>;
      passwordResetTokenRepository: Partial<PasswordResetTokenRepository>;
    }> = {},
  ) => {
    const userRepository: Partial<UserRepository> = {
      getUserByEmail: jest.fn().mockResolvedValue(activeUser),
      updateUserPassword: jest.fn().mockResolvedValue(undefined),
      ...overrides.userRepository,
    };
    const refreshTokenRepository: Partial<RefreshTokenRepository> = {
      revokeAllUserTokens: jest.fn().mockResolvedValue(undefined),
      ...overrides.refreshTokenRepository,
    };
    const passwordResetTokenRepository: Partial<PasswordResetTokenRepository> =
      {
        findValidToken: jest.fn().mockResolvedValue(tokenRecord),
        markTokenAsUsed: jest.fn().mockResolvedValue(undefined),
        ...overrides.passwordResetTokenRepository,
      };

    return {
      userRepository: userRepository as UserRepository,
      refreshTokenRepository: refreshTokenRepository as RefreshTokenRepository,
      passwordResetTokenRepository:
        passwordResetTokenRepository as PasswordResetTokenRepository,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-password');
  });

  /**
   * Verifies that a valid token changes the password and revokes sessions.
   */
  test('updates the password, revokes sessions, and consumes the token', async () => {
    const repositories = buildRepositories();

    await resetPassword(repositories, {
      token: rawToken,
      newPassword: 'Contraseña123!',
    });

    expect(
      repositories.passwordResetTokenRepository.findValidToken,
    ).toHaveBeenCalledWith(tokenHash, expect.any(Date));
    expect(bcrypt.hash).toHaveBeenCalledWith(
      'Contraseña123!',
      expect.any(Number),
    );
    expect(repositories.userRepository.updateUserPassword).toHaveBeenCalledWith(
      'user@test.com',
      'hashed-new-password',
    );
    expect(
      repositories.refreshTokenRepository.revokeAllUserTokens,
    ).toHaveBeenCalledWith(userId);
    expect(
      repositories.passwordResetTokenRepository.markTokenAsUsed,
    ).toHaveBeenCalledWith(tokenHash);
  });

  /**
   * Verifies that weak passwords fail before any token lookup occurs.
   */
  test('rejects weak passwords before querying the token repository', async () => {
    const repositories = buildRepositories();

    await expect(
      resetPassword(repositories, {
        token: rawToken,
        newPassword: 'abc',
      }),
    ).rejects.toMatchObject({
      name: 'PASSWORD_POLICY_ERROR',
    });

    expect(
      repositories.passwordResetTokenRepository.findValidToken,
    ).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  /**
   * Verifies that missing or expired tokens stop the reset flow.
   */
  test('throws RESET_TOKEN_INVALID when token is missing or expired', async () => {
    const repositories = buildRepositories({
      passwordResetTokenRepository: {
        findValidToken: jest.fn().mockResolvedValue(null),
      },
    });

    await expect(
      resetPassword(repositories, {
        token: rawToken,
        newPassword: 'Contraseña123!',
      }),
    ).rejects.toThrow('RESET_TOKEN_INVALID');

    expect(repositories.userRepository.getUserByEmail).not.toHaveBeenCalled();
  });

  /**
   * Verifies that inactive users cannot complete a password reset.
   */
  test('throws USER_NOT_AVAILABLE when the token user is inactive', async () => {
    const repositories = buildRepositories({
      userRepository: {
        getUserByEmail: jest.fn().mockResolvedValue({
          ...activeUser,
          active: false,
        }),
        updateUserPassword: jest.fn(),
      },
    });

    await expect(
      resetPassword(repositories, {
        token: rawToken,
        newPassword: 'Contraseña123!',
      }),
    ).rejects.toThrow('USER_NOT_AVAILABLE');

    expect(
      repositories.userRepository.updateUserPassword,
    ).not.toHaveBeenCalled();
    expect(
      repositories.passwordResetTokenRepository.markTokenAsUsed,
    ).not.toHaveBeenCalled();
  });
});
