import { TextArea } from '@shared/components/ui/TextArea';
import { Select } from '@shared/components/ui/Select';
import type { SearchFormData } from '../../types/searchForm.types';

export interface LocationContextSectionProps {
  formData: Partial<SearchFormData>;
  updateForm: (newData: Partial<SearchFormData>) => void;
  errors: Record<string, string>;
}

export const LocationContextSection = ({
  formData,
  updateForm,
  errors,
}: LocationContextSectionProps) => {
  return (
    <section
      id="location-context-section"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5 py-4"
    >
      <div id="visual-references">
        <TextArea
          id="visual-references"
          label="Referencias visuales del lugar"
          placeholder="Describe puntos de referencia, colores de edificios, negocios cercanos..."
          value={formData.visualReferences || ''}
          maxLength={200}
          onChange={(e) => updateForm({ visualReferences: e.target.value })}
          error={errors.visualReferences}
        />
      </div>

      <div id="zone-type">
        <Select
          id="zone-type"
          label="Tipo de zona"
          value={formData.zoneType || ''}
          onChange={(e) =>
            updateForm({
              zoneType: e.target.value as SearchFormData['zoneType'],
            })
          }
          options={[
            { value: 'Residential', label: 'Residencial' },
            { value: 'Rural', label: 'Rural' },
            { value: 'City', label: 'Ciudad' },
            { value: 'Highway', label: 'Carretera' },
          ]}
          error={errors.zoneType}
        />
      </div>

      <div id="additional-circumstances">
        <TextArea
          id="additional-circumstances"
          label="¿Hay circunstancias adicionales?"
          placeholder="Obras en la zona, eventos recientes, cambios en el entorno..."
          value={formData.additionalCircumstances || ''}
          maxLength={300}
          onChange={(e) =>
            updateForm({ additionalCircumstances: e.target.value })
          }
          error={errors.additionalCircumstances}
        />
      </div>
    </section>
  );
};
