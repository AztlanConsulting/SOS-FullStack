/**
 * Convierte un color Hexadecimal a RGB
 */
const hexToRgb = (hex: string) => {
  // Quitamos el '#' si existe
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

/**
 * Convierte valores RGB a Hexadecimal
 */
const rgbToHex = (r: number, g: number, b: number) => {
  return (
    '#' +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
  );
};

/**
 * Genera un arreglo de colores en gradiente entre dos colores Hex
 */
export const generateColorGradient = (
  startHex: string,
  endHex: string,
  steps: number,
): string[] => {
  if (steps <= 1) return [startHex]; // Prevención de errores si solo hay 1 dato

  const start = hexToRgb(startHex);
  const end = hexToRgb(endHex);
  const colors: string[] = [];

  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1); // Calcula el porcentaje de avance entre el paso 0 y el último
    const r = Math.round(start.r + ratio * (end.r - start.r));
    const g = Math.round(start.g + ratio * (end.g - start.g));
    const b = Math.round(start.b + ratio * (end.b - start.b));

    colors.push(rgbToHex(r, g, b));
  }

  return colors;
};
