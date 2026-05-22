import { TextArea } from '@shared/components/ui/TextArea';
import { Select } from '@shared/components/ui/Select';
import type { SearchFormData } from '../../types/searchForm.types';

export interface SearchContextSectionProps {
  formData: Partial<SearchFormData>;
  updateForm: (newData: Partial<SearchFormData>) => void;
  errors: Record<string, string>;
}

export const SearchContextSection = ({
  formData,
  updateForm,
  errors,
}: SearchContextSectionProps) => {
  return (
    <section
      id="search-context-section"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5 py-4"
    >
      <div id="help-count">
        <Select
          id="help-count"
          label="¿Cuentas con ayuda?"
          value={formData.helpCount || ''}
          onChange={(e) =>
            updateForm({
              helpCount: e.target.value as SearchFormData['helpCount'],
            })
          }
          options={[
            { value: 'Several people', label: 'Varias personas' },
            { value: '1-2 people', label: '1-2 personas' },
            { value: 'Alone', label: 'Solo' },
          ]}
          error={errors.helpCount}
        />
      </div>

      <div id="nearby-features">
        <TextArea
          id="nearby-features"
          label="¿Qué hay cerca del lugar?"
          placeholder="Parques, escuelas, zonas comerciales, ríos..."
          value={formData.nearbyFeatures || ''}
          maxLength={200}
          onChange={(e) => updateForm({ nearbyFeatures: e.target.value })}
          error={errors.nearbyFeatures}
        />
      </div>

      <div id="street-animals">
        <Select
          id="street-animals"
          label="¿Hay animales callejeros?"
          value={formData.streetAnimals || ''}
          onChange={(e) =>
            updateForm({
              streetAnimals: e.target.value as SearchFormData['streetAnimals'],
            })
          }
          options={[
            { value: 'Many', label: 'Muchos' },
            { value: 'Few', label: 'Pocos' },
            { value: 'None', label: 'Ninguno' },
            { value: 'Unknown', label: 'No sé' },
          ]}
          error={errors.streetAnimals}
        />
      </div>

      <div id="traffic-level">
        <Select
          id="traffic-level"
          label="Nivel de tráfico vehicular"
          value={formData.trafficLevel || ''}
          onChange={(e) =>
            updateForm({
              trafficLevel: e.target.value as SearchFormData['trafficLevel'],
            })
          }
          options={[
            { value: 'High', label: 'Alto' },
            { value: 'Medium', label: 'Medio' },
            { value: 'Low', label: 'Bajo' },
          ]}
          error={errors.trafficLevel}
        />
      </div>

      <div id="zone-familiarity">
        <Select
          id="zone-familiarity"
          label="¿Qué tan familiar es la zona?"
          value={formData.zoneFamiliarity || ''}
          onChange={(e) =>
            updateForm({
              zoneFamiliarity: e.target
                .value as SearchFormData['zoneFamiliarity'],
            })
          }
          options={[
            { value: 'Very familiar', label: 'Muy familiar' },
            { value: 'Somewhat', label: 'Poco' },
            { value: 'Not at all', label: 'Nada' },
          ]}
          error={errors.zoneFamiliarity}
        />
      </div>
    </section>
  );
};
