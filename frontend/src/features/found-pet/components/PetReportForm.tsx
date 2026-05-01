import React from 'react';
import { UserInfoSection } from '@features/users/components/UserInfoSection';
import { PetPhotosSection } from './PetPhotoSection';
import { PetLocationSection } from '@features/users/components/PetLocationSection';
import { ContactInfoSection } from '@features/users/components/ContactInfoSection';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import { Modal } from '@/shared/components/ui/Modal/Modal';
import type { FoundPetReportData } from '@/shared/types/petReport.types';
import { usePetReportForm } from '../hooks/usePetReportForms';
import { useNavigate } from 'react-router';

export interface PetReportFormProps {
  initialData?: Partial<FoundPetReportData>;
}

export const PetReportForm: React.FC<PetReportFormProps> = ({
  initialData,
}) => {
  const {
    formData,
    errors,
    updateFormData,
    handleNext,
    isSubmitting,
    submitError,
    success,
    handleClean,
  } = usePetReportForm(initialData);
  const navigate = useNavigate();

  return (
    <div id="report-section" className="min-h-screen pb-24 pt-8 bg-white">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
        {/* Section 1: General pet data */}
        <div id="user-info-section">
          <Text variant="h2" as="h2" weight="medium" className="text-center">
            Información de la mascota
          </Text>
        </div>
        <UserInfoSection
          formData={formData}
          updateForm={updateFormData}
          errors={errors}
          hideNameInput
          reportType="found"
        />

        {/* Section 2: Photos of the pet */}
        <div id="pet-photos-section">
          <Text variant="h2" as="h2" weight="medium" className="text-center">
            Fotos de la mascota
          </Text>
        </div>
        <PetPhotosSection
          formData={formData}
          updateForm={updateFormData}
          errors={errors}
        />

        {/* Section 3: Where the pet went lost. */}
        <section
          id="pet-location-input"
          className="w-full mx-auto flex flex-col py-4 bg-white gap-8"
        >
          <div id="pet-location-section">
            <Text variant="h2" as="h2" weight="medium" className="text-center">
              ¿Dónde se encontró?
            </Text>
          </div>
          <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
            <PetLocationSection
              formData={formData}
              updateForm={updateFormData}
              errors={errors}
              reportType="found"
            />
          </div>
        </section>

        {/* Section 4: Owner information. */}
        <Text
          variant="h2"
          as="h2"
          weight="medium"
          className="text-center text-xl md:text-2xl "
        >
          Información de contacto
        </Text>
        <ContactInfoSection<FoundPetReportData>
          formData={formData}
          updateForm={updateFormData}
          errors={errors}
          owner={false}
        />

        {/* Section 5: Confirmation button. */}
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col py-4">
          {submitError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <Button
            onClick={handleNext}
            label="Reportar mascota encontrada"
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          />
        </div>
      </div>
      {success && (
        <Modal
          title="¡Mascota reportada!"
          description="Gracias por reportar la mascota perdida."
          onClose={() => {
            navigate('/mascotas-encontradas');
            handleClean();
          }}
        />
      )}
    </div>
  );
};
