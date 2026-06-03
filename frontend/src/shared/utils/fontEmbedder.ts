export const loadFontAsDataUrl = async (fontPath: string): Promise<string> => {
  try {
    const response = await fetch(fontPath);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Extract base64 part from data URL
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert font to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load font as data URL:', error);
    throw error;
  }
};

export const createFontFaceStyleElement = (
  fontBase64: string,
): HTMLStyleElement => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Work Sans Embedded';
      src: url(data:font/truetype;base64,${fontBase64}) format('truetype');
      font-weight: 100 900;
      font-display: swap;
    }
  `;
  return style;
};

export const embedFontForExport = async (
  fontPath: string,
  targetElement?: HTMLElement,
): Promise<() => void> => {
  try {
    const fontBase64 = await loadFontAsDataUrl(fontPath);
    const styleElement = createFontFaceStyleElement(fontBase64);

    // If target element provided, append to it, otherwise append to document head
    const container = targetElement || document.head;
    container.appendChild(styleElement);

    // Return cleanup function
    return () => {
      styleElement.remove();
    };
  } catch (error) {
    console.error('Failed to embed font:', error);
    // Return no-op cleanup function
    return () => {};
  }
};
