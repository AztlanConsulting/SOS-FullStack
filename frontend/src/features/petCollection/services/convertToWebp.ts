// Generado por IA - Convierte una imagen a webp para que subir archivos sea más rápido
async function convertToWebP(file: File, quality = 0.5): Promise<File> {
  return file;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Conversion failed'));
            return;
          }

          resolve(
            new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
              type: 'image/webp',
            }),
          );
        },
        'image/webp',
        quality,
      );
    };

    reader.readAsDataURL(file);
  });
}

export default convertToWebP;
