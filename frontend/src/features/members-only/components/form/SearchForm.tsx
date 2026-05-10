import React from 'react';
import { useNavigate } from 'react-router';
import { BasicPetInfoSection } from './BasicPetInfoSection';
import { LocationContextSection } from './LocationContextSection';
import { BehaviorPersonalitySection } from './BehaviorPersonalitySection';
import { SearchContextSection } from './SearchContextSection';
import { FilesSubmissionSection } from './FilesSubmissionSection';
import { useSearchForm } from '../../hooks/useSearchForm';
import { Text } from '@shared/components/ui/Text';
import type { SearchFormData } from '../../types/searchForm.types';
import { PreferencesMotivatorsSection } from './PreferencesMotivatorsSection';
import { Modal } from '@/shared/components/ui/Modal/Modal';

export interface SearchFormProps {
  initialData?: Partial<SearchFormData>;
}

export const SearchForm: React.FC<SearchFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    updateFormData,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
    resetForm,
  } = useSearchForm(initialData);

  return (
    <div id="search-form-section" className="min-h-screen pt-8 bg-white">
      <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
        <div id="basic-pet-info-header">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center mb-6 mt-2"
          >
            Información básica de la mascota
          </Text>
          <BasicPetInfoSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        <div id="location-context-header">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6"
          >
            Ubicación y contexto
          </Text>
          <LocationContextSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        <div id="behavior-personality-header">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6"
          >
            Comportamiento y personalidad
          </Text>
          <BehaviorPersonalitySection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        <div id="search-context-header">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6"
          >
            Contexto de búsqueda
          </Text>
          <SearchContextSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        <div id="preferences-motivators-header">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6"
          >
            Preferencias y motivadores
          </Text>
          <PreferencesMotivatorsSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
          />
        </div>

        <div id="files-submission-header">
          <Text
            variant="h2"
            as="h2"
            weight="medium"
            className="text-center text-xl md:text-2xl font-medium text-gray-800 mb-6"
          >
            Documentos y envío
          </Text>
          <FilesSubmissionSection
            formData={formData}
            updateForm={updateFormData}
            errors={errors}
            onSubmit={handleSubmit}
          />
        </div>

        {isSubmitting && (
          <div className="text-center text-blue-600">
            Enviando formulario...
          </div>
        )}

        {submitError && (
          <div className="text-center text-red-600">Error: {submitError}</div>
        )}

        {submitSuccess && (
          <Modal
            color="purple"
            title="¡Reporte enviado!"
            description="Gracias por reportar la mascota perdida."
            onClose={() => {
              resetForm();
              navigate('/inicio/contenido-exclusivo/formulario');
            }}
          />
        )}
      </div>
    </div>
  );
};
