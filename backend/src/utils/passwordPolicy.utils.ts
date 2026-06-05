export const PASSWORD_POLICY_ERROR_CODE = 'PASSWORD_POLICY_ERROR';
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_POLICY_MESSAGE = `La contraseña debe incluir al menos ${PASSWORD_MIN_LENGTH} caracteres, una letra mayúscula, una letra minúscula, un número y un símbolo. No debe contener espacios.`;

const formatMissingRequirements = (requirements: string[]): string => {
  if (requirements.length === 1) {
    return requirements[0];
  }

  return `${requirements.slice(0, -1).join(', ')} y ${requirements[requirements.length - 1]}`;
};

export const getPasswordPolicyMissingRequirements = (
  password: string,
): string[] => {
  const missingRequirements: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    missingRequirements.push(`al menos ${PASSWORD_MIN_LENGTH} caracteres`);
  }

  if (!/\p{Lu}/u.test(password)) {
    missingRequirements.push('una letra mayúscula');
  }

  if (!/\p{Ll}/u.test(password)) {
    missingRequirements.push('una letra minúscula');
  }

  if (!/\p{N}/u.test(password)) {
    missingRequirements.push('un número');
  }

  if (!/[\p{P}\p{S}]/u.test(password)) {
    missingRequirements.push('un símbolo');
  }

  return missingRequirements;
};

/**
 * Validates the password policy used when users reset their password.
 *
 * @param password - Plain text password provided by the user
 * @return Policy error message when the password is not strong enough
 */
export const getPasswordPolicyError = (password: string): string | null => {
  const missingRequirements = getPasswordPolicyMissingRequirements(password);
  const hasWhitespace = /\s/.test(password);

  if (missingRequirements.length === 0 && !hasWhitespace) {
    return null;
  }

  const policyMessages: string[] = [];

  if (missingRequirements.length > 0) {
    policyMessages.push(
      `La contraseña debe incluir ${formatMissingRequirements(missingRequirements)}.`,
    );
  }

  if (hasWhitespace) {
    policyMessages.push('No debe contener espacios.');
  }

  return policyMessages.join(' ');
};
