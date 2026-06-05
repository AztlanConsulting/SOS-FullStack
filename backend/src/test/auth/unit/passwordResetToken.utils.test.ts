import {
  createRawPasswordResetToken,
  hashPasswordResetToken,
} from '@utils/passwordResetToken.utils';

describe('password reset token utils (unit)', () => {
  /**
   * Verifies that generated reset tokens keep the expected hex format.
   */
  test('creates a cryptographic hex token', () => {
    const token = createRawPasswordResetToken();

    expect(token).toHaveLength(64);
    expect(token).toMatch(/^[a-f0-9]{64}$/);
  });

  /**
   * Verifies that token hashing is stable and never exposes the raw token.
   */
  test('hashes a token deterministically without returning the raw value', () => {
    const token = 'raw-token';
    const firstHash = hashPasswordResetToken(token);
    const secondHash = hashPasswordResetToken(token);

    expect(firstHash).toBe(secondHash);
    expect(firstHash).toHaveLength(64);
    expect(firstHash).not.toBe(token);
  });
});
