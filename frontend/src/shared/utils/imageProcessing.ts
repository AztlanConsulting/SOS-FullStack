export const processImageForPoster = async (file: File): Promise<File> => {
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

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert canvas to blob'));
              return;
            }

            // Create new File with normalized image
            const processedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.jpg'),
              { type: 'image/jpeg' },
            );

            resolve(processedFile);
          },
          'image/jpeg',
          0.95,
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const processImagesForPoster = async (
  files: File[],
): Promise<File[]> => {
  const processedFiles = await Promise.all(
    files.map(async (file) => {
      try {
        // Only process image files
        if (file.type.startsWith('image/')) {
          return await processImageForPoster(file);
        }
        return file;
      } catch (error) {
        console.warn(`Failed to process image ${file.name}:`, error);
        return file; // Return original if processing fails
      }
    }),
  );

  return processedFiles;
};
