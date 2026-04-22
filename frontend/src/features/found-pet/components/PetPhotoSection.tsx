import { FileUpload } from '../../../shared/components/ui/FileUpload/FileUpload';
import type { PetReportData } from '../types/petReport.types';
import { usePetPhotos } from '../hooks/usePetPhotos';

export interface PetPhotosSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
}

export const PetPhotosSection = ({
  formData,
  updateForm,
}: PetPhotosSectionProps) => {
  const { handleFileUpload } = usePetPhotos(formData, updateForm);
  return (
    <section
      id="photo-upload-section"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl  max-w-lg mx-auto"
    >
      <div className="w-full max-w-lg mx-auto flex flex-col gap-3">
        <FileUpload index={1} onChange={(file) => handleFileUpload(1, file)} />
      </div>
    </section>
  );
};
