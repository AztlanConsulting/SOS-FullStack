import { describe, expect, test } from 'vitest';
import {
  getPasswordPolicyError,
  getPasswordPolicyErrorItems,
} from '@features/auth/utils/passwordPolicy';

describe('password policy utility (unit)', () => {
  /**
   * Verifies that secure passwords produce no frontend validation errors.
   */
  test('returns no errors for a secure password', () => {
    expect(getPasswordPolicyErrorItems('Contraseña123!')).toEqual([]);
    expect(getPasswordPolicyError('Contraseña123!')).toBeNull();
  });

  /**
   * Verifies that each missing password rule is returned as a separate item.
   */
  test('returns each missing requirement as a separate item', () => {
    const items = getPasswordPolicyErrorItems('abc');

    expect(items).toEqual([
      'Debe tener al menos 12 caracteres',
      'Debe incluir una letra mayúscula',
      'Debe incluir un número',
      'Debe incluir un símbolo',
    ]);
  });

  /**
   * Verifies that the UI message preserves the site's bullet-point style.
   */
  test('formats missing requirements as bullet points for the UI', () => {
    const message = getPasswordPolicyError('abc');

    expect(message).toBe(
      [
        '• Debe tener al menos 12 caracteres',
        '• Debe incluir una letra mayúscula',
        '• Debe incluir un número',
        '• Debe incluir un símbolo',
      ].join('\n'),
    );
  });

  /**
   * Verifies whitespace errors without rejecting valid accented letters.
   */
  test('detects whitespace without marking unicode letters as invalid', () => {
    const items = getPasswordPolicyErrorItems('Árbol Seguro123!');

    expect(items).toEqual(['No debe contener espacios']);
  });
});
