import { FileUpload } from '@shared/components/ui/FileUpload/FileUpload';
import { PhotoDistributionPicker } from './PhotoDistributionPicker';
import { usePetPhotos } from '@shared/hooks/usePetPhotos';
import type { LostPetReportData } from '@/shared/types/petReport.types';

export interface PetPhotosSectionProps {
  formData: Partial<LostPetReportData>;
  updateForm: (newData: Partial<LostPetReportData>) => void;
  errors?: Record<string, string>;
}

export const PetPhotosSection = ({
  formData,
  updateForm,
  errors = {},
}: PetPhotosSectionProps) => {
  const { photoCount, fileUploadSlots, handleFileUpload } = usePetPhotos(
    formData,
    updateForm,
  );

  const handleLayoutChange = (val: 1 | 2 | 3 | 4) => {
    // Apply as one atomic update to avoid stale-state overwrites in confirmation.
    updateForm({ imageLayout: val.toString(), images: [] });
  };

  return (
    <section
      id="photo-upload-section"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6 py-4"
    >
      <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
        <p className="text-sm text-gray-700 font-medium">
          Selecciona la distribución de las fotos
        </p>
        <PhotoDistributionPicker
          value={photoCount}
          onChange={handleLayoutChange}
        />
      </div>

      {/* Image upload slots according to the chosen layout */}
      <div className="flex flex-col gap-3 mt-2 w-full max-w-lg mx-auto">
        <p className="text-sm text-gray-700 font-medium">
          Sube fotos de tu mascota
        </p>

        {fileUploadSlots.map((num) => (
          <FileUpload
            key={num}
            index={num}
            onChange={(file) => handleFileUpload(num, file)}
            error={errors[`images_${num}`]}
            currentFileName={formData.images?.[num - 1]?.name}
          />
        ))}
      </div>
    </section>
  );
};
