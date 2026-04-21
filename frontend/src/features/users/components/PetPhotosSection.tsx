import { FileUpload } from '../../../shared/components/ui/FileUpload/FileUpload';
import { PhotoDistributionPicker } from './PhotoDistributionPicker';
import type { PetReportData } from '../types/petReport.types';
import { usePetPhotos } from '../hooks/usePetPhotos';

export interface PetPhotosSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
  errors: Record<string, string>;
}

export const PetPhotosSection = ({
  formData,
  updateForm,
  errors,
}: PetPhotosSectionProps) => {
  const { photoCount, fileUploadSlots, handleFileUpload } = usePetPhotos(
    formData,
    updateForm,
  );
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
          onChange={(val) => updateForm({ imageLayout: val.toString() })}
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
            error={errors.images}
          />
        ))}
      </div>
    </section>
  );
};
