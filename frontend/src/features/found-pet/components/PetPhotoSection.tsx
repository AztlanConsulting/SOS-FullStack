import type { FoundPetReportData } from '@/shared/types/petReport.types';
import { FileUpload } from '../../../shared/components/ui/FileUpload/FileUpload';
import { usePetPhotos } from '@/shared/hooks/usePetPhotos';

export interface PetPhotosSectionProps {
  formData: Partial<FoundPetReportData>;
  updateForm: (newData: Partial<FoundPetReportData>) => void;
  errors?: Record<string, string>;
}

export const PetPhotosSection = ({
  formData,
  updateForm,
  errors = {},
}: PetPhotosSectionProps) => {
  const { handleFileUpload } = usePetPhotos(formData, updateForm);
  console.log(errors);
  return (
    <section id="photo-upload-section" className="w-full mx-auto">
      <div className="w-5/6 lg:w-full  mx-auto flex flex-col gap-3">
        <FileUpload
          index={1}
          onChange={(file) => handleFileUpload(1, file)}
          error={errors[`images`]}
          currentFileName={formData.images?.[0]?.name}
          defaultDisplayName="Subir foto"
        />
      </div>
    </section>
  );
};
