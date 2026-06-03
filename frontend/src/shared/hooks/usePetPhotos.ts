import type { LostPetReportData } from '@/shared/types/petReport.types';
import { useEffect, useRef } from 'react';
import heic2any from 'heic2any';

export const usePetPhotos = (
  formData: Partial<LostPetReportData>,
  updateForm: (newData: Partial<LostPetReportData>) => void,
) => {
  const photoCount = parseInt(formData.imageLayout || '3') as 1 | 2 | 3 | 4;
  const fileUploadSlots = Array.from({ length: photoCount }, (_, i) => i + 1);
  const isFirstRender = useRef(true);

  const handleFileUpload = async (index: number, file: File | null) => {
    let newImages = [...(formData.images || [])];

    if (file) {
      // Check if it's a HEIC / HEIF file by type or file extension
      const isHeic =
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif');

      let fileToSave = file;

      if (isHeic) {
        try {
          // Convert the HEIC blob into a standard JPEG blob
          const conversionResult = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8, // Good balance of sharpness and performance
          });

          const blob = Array.isArray(conversionResult)
            ? conversionResult[0]
            : conversionResult;
          const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');

          // Rebuild it as a clean standard File object
          fileToSave = new File([blob], newFileName, { type: 'image/jpeg' });
        } catch (error) {
          console.error(
            'Failed to convert HEIC image, using original file fallback:',
            error,
          );
          // If conversion fails, we let it pass through to prevent locking up the UI
          fileToSave = file;
        }
      }

      newImages[index - 1] = fileToSave;
    } else {
      newImages.splice(index - 1, 1);
    }

    if (newImages.length > photoCount) {
      newImages = newImages.slice(0, photoCount);
    }

    updateForm({ images: newImages });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (formData.images && formData.images.length > photoCount) {
      updateForm({ images: formData.images.slice(0, photoCount) });
    }
  }, [photoCount]);

  return { photoCount, fileUploadSlots, handleFileUpload };
};
