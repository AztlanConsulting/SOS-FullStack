export function parseBase64Image(imageBase64: string): Buffer | null {
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return null;
  }

  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  try {
    return Buffer.from(base64Data, 'base64');
  } catch {
    return null;
  }
}
