import { getPasswordPolicyError } from '@utils/passwordPolicy.utils';

describe('password policy utils (unit)', () => {
  /**
   * Verifies that a password meeting every rule passes validation.
   */
  test('returns null for a secure password', () => {
    const result = getPasswordPolicyError('Contraseña123!');

    expect(result).toBeNull();
  });

  /**
   * Verifies that weak passwords report each missing requirement.
   */
  test('returns the missing requirements for a weak password', () => {
    const result = getPasswordPolicyError('abc');

    expect(result).toContain('al menos 12 caracteres');
    expect(result).toContain('una letra mayúscula');
    expect(result).toContain('un número');
    expect(result).toContain('un símbolo');
    expect(result).not.toContain('una letra minúscula');
  });

  /**
   * Verifies that spaces are rejected by the password policy.
   */
  test('rejects passwords with whitespace', () => {
    const result = getPasswordPolicyError('Contraseña 123!');

    expect(result).toContain('No debe contener espacios');
  });

  /**
   * Verifies that accented uppercase and lowercase letters are accepted.
   */
  test('accepts unicode uppercase and lowercase letters', () => {
    const result = getPasswordPolicyError('ÁrbolSeguro123!');

    expect(result).toBeNull();
  });
});
