export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_POLICY_MESSAGE = `La contraseña debe incluir al menos ${PASSWORD_MIN_LENGTH} caracteres, una letra mayúscula, una letra minúscula, un número y un símbolo. No debe contener espacios.`;

export const getPasswordPolicyErrorItems = (password: string): string[] => {
  const errorItems: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errorItems.push(`Debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`);
  }

  if (!/\p{Lu}/u.test(password)) {
    errorItems.push('Debe incluir una letra mayúscula');
  }

  if (!/\p{Ll}/u.test(password)) {
    errorItems.push('Debe incluir una letra minúscula');
  }

  if (!/\p{N}/u.test(password)) {
    errorItems.push('Debe incluir un número');
  }

  if (!/[\p{P}\p{S}]/u.test(password)) {
    errorItems.push('Debe incluir un símbolo');
  }

  if (/\s/.test(password)) {
    errorItems.push('No debe contener espacios');
  }

  return errorItems;
};

export const getPasswordPolicyError = (password: string): string | null => {
  const errorItems = getPasswordPolicyErrorItems(password);

  if (errorItems.length === 0) {
    return null;
  }

  return errorItems.map((item) => `• ${item}`).join('\n');
};
