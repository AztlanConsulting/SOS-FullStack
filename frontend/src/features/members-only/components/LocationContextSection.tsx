import { TextArea } from '@shared/components/ui/TextArea';
import { Select } from '@shared/components/ui/Select';
import type { SearchFormData } from '../types/searchForm.types';

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
      <div id="referencias-visuales">
        <TextArea
          id="referencias-visuales"
          label="Referencias visuales del lugar"
          placeholder="Describe puntos de referencia, colores de edificios, negocios cercanos..."
          value={formData.referenciasVisuales || ''}
          maxLength={200}
          onChange={(e) => updateForm({ referenciasVisuales: e.target.value })}
          error={errors.referenciasVisuales}
        />
      </div>

      <div id="tipo-zona">
        <Select
          id="tipo-zona"
          label="Tipo de zona"
          value={formData.tipoZona || ''}
          onChange={(e) =>
            updateForm({
              tipoZona: e.target.value as SearchFormData['tipoZona'],
            })
          }
          options={[
            { value: 'Residencial', label: 'Residencial' },
            { value: 'Rural', label: 'Rural' },
            { value: 'Ciudad', label: 'Ciudad' },
            { value: 'Carretera', label: 'Carretera' },
          ]}
          error={errors.tipoZona}
        />
      </div>

      <div id="circunstancias">
        <TextArea
          id="circunstancias"
          label="¿Hay circunstancias adicionales?"
          placeholder="Obras en la zona, eventos recientes, cambios en el entorno..."
          value={formData.circunstanciasAdicionales || ''}
          maxLength={300}
          onChange={(e) =>
            updateForm({ circunstanciasAdicionales: e.target.value })
          }
          error={errors.circunstanciasAdicionales}
        />
      </div>
    </section>
  );
};
