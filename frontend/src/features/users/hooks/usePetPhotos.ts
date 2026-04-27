import { useEffect, useRef } from 'react';
import type { PetReportData } from '../types/petReport.types';

export const usePetPhotos = (
  formData: Partial<PetReportData>,
  updateForm: (newData: Partial<PetReportData>) => void,
) => {
  const photoCount = parseInt(formData.imageLayout || '3') as 1 | 2 | 3 | 4;
  const fileUploadSlots = Array.from({ length: photoCount }, (_, i) => i + 1);
  const isFirstRender = useRef(true);

  const handleFileUpload = (index: number, file: File | null) => {
    let newImages = [...(formData.images || [])];

    if (file) {
      newImages[index - 1] = file;
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
