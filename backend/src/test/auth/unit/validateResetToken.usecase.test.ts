import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import { validateResetToken } from '@use-cases/auth/validateResetToken.usecase';
import { hashPasswordResetToken } from '@utils/passwordResetToken.utils';

describe('validateResetToken use-case (unit)', () => {
  /**
   * Verifies that blank tokens fail before touching the repository.
   */
  test('returns false for empty tokens without querying the repository', async () => {
    const repository: Partial<PasswordResetTokenRepository> = {
      findValidToken: jest.fn(),
    };

    const result = await validateResetToken(
      repository as PasswordResetTokenRepository,
      '   ',
    );

    expect(result).toBe(false);
    expect(repository.findValidToken).not.toHaveBeenCalled();
  });

  /**
   * Verifies that valid raw tokens are normalized and looked up by hash.
   */
  test('returns true when the token repository finds a valid token', async () => {
    const repository: Partial<PasswordResetTokenRepository> = {
      findValidToken: jest.fn().mockResolvedValue({ tokenHash: 'hash' }),
    };

    const result = await validateResetToken(
      repository as PasswordResetTokenRepository,
      ' raw-token ',
    );

    expect(result).toBe(true);
    expect(repository.findValidToken).toHaveBeenCalledWith(
      hashPasswordResetToken('raw-token'),
      expect.any(Date),
    );
  });

  /**
   * Verifies that missing repository matches are exposed as invalid tokens.
   */
  test('returns false when the token repository does not find a match', async () => {
    const repository: Partial<PasswordResetTokenRepository> = {
      findValidToken: jest.fn().mockResolvedValue(null),
    };

    const result = await validateResetToken(
      repository as PasswordResetTokenRepository,
      'raw-token',
    );

    expect(result).toBe(false);
  });
});
