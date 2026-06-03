export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const processAndConvertToDataURL = async (
  file: File,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas (this removes EXIF data and normalizes the format)
        ctx.drawImage(img, 0, 0);

        // Convert to data URL with good quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Set crossOrigin before setting src
      img.crossOrigin = 'anonymous';
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const processFilesToDataURLs = async (
  files: File[],
): Promise<string[]> => {
  const dataUrls = await Promise.all(
    files.map(async (file) => {
      try {
        // Process image files to remove EXIF and normalize
        if (file && file.type.startsWith('image/')) {
          return await processAndConvertToDataURL(file);
        }
        // For non-image files, just convert to data URL
        return file ? await fileToDataURL(file) : '';
      } catch (error) {
        console.warn(`Failed to process file ${file?.name}:`, error);
        // Return empty string if processing fails
        return '';
      }
    }),
  );

  return dataUrls;
};
