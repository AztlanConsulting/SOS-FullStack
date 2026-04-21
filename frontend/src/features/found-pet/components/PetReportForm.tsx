import React from 'react';
import type { PetReportData } from '../types/petReport.types';
import { UserInfoSection } from './UserInfoSection';
import { PetPhotosSection } from './PetPhotoSection';
import { PetLocationSection } from './FoundLocation';
import { ContactInfoSection } from './ContactInfoSection';
import { usePetReportForm } from '../hooks/usePetReportForms';
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

  const renderSectionErrors = (fieldNames: string[]) => {
    const sectionErrors = fieldNames
      .map((field) => errors[field])
      .filter(Boolean);

    if (sectionErrors.length === 0) return null;

    return (
      <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <ul className="list-disc pl-5 space-y-1">
          {sectionErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div id="report-section" className="min-h-screen pb-24 pt-8 bg-white">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-8">
        {/* Section 1: General pet data */}
        <div id="user-info-section">
          <Text variant="h2" as="h2" weight="medium" className="text-center">
            Información de la mascota
          </Text>
        </div>
        {renderSectionErrors(['name', 'species', 'date', 'breed', 'color'])}
        <UserInfoSection formData={formData} updateForm={updateFormData} />

        {/* Section 2: Photos of the pet */}
        <div id="pet-photos-section">
          <Text variant="h2" as="h2" weight="medium" className="text-center">
            Fotos de la mascota
          </Text>
        </div>
        {renderSectionErrors(['images'])}
        <PetPhotosSection formData={formData} updateForm={updateFormData} />

        {/* Section 3: Where the pet went lost. */}
        {renderSectionErrors(['address'])}
        <PetLocationSection formData={formData} updateForm={updateFormData} />

        {/* Section 4: Owner information. */}
        {renderSectionErrors(['contactName', 'phoneNumber', 'email'])}
        <ContactInfoSection formData={formData} updateForm={updateFormData} />

        {/* Section 5: Confirmation button. */}
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto">
          <div className="w-full w-max-lg mx-auto flex justify-center [&>button]:whitespace-nowrap">
            <Button
              onClick={handleNext}
              label="Reportar mascota encontrada"
              variant="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
