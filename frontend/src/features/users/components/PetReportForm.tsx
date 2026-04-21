import React from 'react';
import type { PetReportData } from '../types/petReport.types';
import { UserInfoSection } from './UserInfoSection';
import { PetPhotosSection } from './PetPhotosSection';
import { PetLocationSection } from './PetLocationSection';
import { ContactInfoSection } from './ContactInfoSection';
import { usePetReportForm } from '../hooks/usePetReportForm';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';

export interface PetReportFormProps {
  initialData?: Partial<PetReportData>;
}

export const PetReportForm: React.FC<PetReportFormProps> = ({
  initialData,
}) => {
  const { formData, errors, updateFormData, handleNext } =
    usePetReportForm(initialData);

  return (
    <div id="report-section" className="min-h-screen pb-24 pt-8 bg-white">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
        {/* Section 1: General pet data */}
        <div id="user-info-section">
          <Text variant="h2" as="h2" weight="medium">
            Información de la mascota
          </Text>
          <UserInfoSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        {/* Section 2: Photos of the pet */}
        <div id="pet-photos-section">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6"
          >
            Fotos de la mascota
          </Text>
          <PetPhotosSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        {/* Section 3: Where the pet went lost. */}
        <div id="pet-location-section">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6"
          >
            Dónde se perdió
          </Text>
          <PetLocationSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        {/* Section 4: Owner information. */}
        <div id="contact-info-section">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6"
          >
            Información de contacto
          </Text>
          <ContactInfoSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        {/* Section 5: Confirmation button. */}
        <div className="w-full max-w-5xl mx-auto px-4 md:px-0">
          <div className="w-full flex justify-center [&>button]:w-full [&>button]:max-w-none [&>button]:whitespace-nowrap">
            <Button
              onClick={handleNext}
              label="Contratar el servicio"
              variant="plans"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
