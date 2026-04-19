import { useEffect } from 'react';
import { FileUpload } from '../../../shared/components/ui/FileUpload/FileUpload';
import { PhotoDistributionPicker } from './PhotoDistributionPicker';
import type { PetReportData } from '../types/petReport.types';

export interface PetPhotosSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
}

export const PetPhotosSection = ({
  formData,
  updateForm,
}: PetPhotosSectionProps) => {
  const photoCount = parseInt(formData.imageLayout || '3') as 1 | 2 | 3 | 4;

  const fileUploadSlots = Array.from({ length: photoCount }, (_, i) => i + 1);

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
    if (formData.images && formData.images.length > photoCount) {
      updateForm({ images: formData.images.slice(0, photoCount) });
    }
  }, [photoCount]);

  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6 py-4">
      <h3 className="text-xl font-bold text-center mb-1">
        Fotos de la mascota
      </h3>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-700 font-medium">
          Selecciona la distribución de las fotos
        </p>
        <PhotoDistributionPicker
          value={photoCount}
          onChange={(val) => updateForm({ imageLayout: val.toString() })}
        />
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <p className="text-sm text-gray-700 font-medium">
          Sube fotos de tu mascota
        </p>

        {fileUploadSlots.map((num) => (
          <FileUpload
            key={num}
            index={num}
            onChange={(file) => handleFileUpload(num, file)}
          />
        ))}
      </div>
    </section>
  );
};
