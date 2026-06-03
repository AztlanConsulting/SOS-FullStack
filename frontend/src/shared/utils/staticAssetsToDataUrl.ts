export const convertImageToDataURL = async (
  imageSrc: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Try to preserve the original format if it's webp
      const mimeType = imageSrc.includes('.webp') ? 'image/webp' : 'image/png';
      const dataUrl = canvas.toDataURL(mimeType, 1);
      resolve(dataUrl);
    };

    img.onerror = (error) => {
      reject(new Error(`Failed to load image: ${imageSrc}`));
    };

    img.src = imageSrc;
  });
};

// Cache for converted images to avoid reconverting
const dataUrlCache = new Map<string, string>();

export const getStaticImageAsDataURL = async (
  imageSrc: string,
): Promise<string> => {
  // Check cache first
  if (dataUrlCache.has(imageSrc)) {
    return dataUrlCache.get(imageSrc)!;
  }

  try {
    const dataUrl = await convertImageToDataURL(imageSrc);
    dataUrlCache.set(imageSrc, dataUrl);
    return dataUrl;
  } catch (error) {
    console.warn(`Failed to convert image to data URL: ${imageSrc}`, error);
    // Return original source as fallback
    return imageSrc;
  }
};

// Preload and convert multiple images
export const preloadStaticImages = async (
  imageSources: string[],
): Promise<Record<string, string>> => {
  const results: Record<string, string> = {};

  await Promise.all(
    imageSources.map(async (src) => {
      try {
        results[src] = await getStaticImageAsDataURL(src);
      } catch (error) {
        console.warn(`Failed to preload image: ${src}`, error);
        results[src] = src; // Use original as fallback
      }
    }),
  );

  return results;
};
