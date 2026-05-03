import { TextArea } from '@shared/components/ui/TextArea';
import { Select } from '@shared/components/ui/Select';
import type { SearchFormData } from '../types/searchForm.types';

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
      <div id="cuenta-ayuda">
        <Select
          id="cuenta-ayuda"
          label="¿Cuentas con ayuda?"
          value={formData.cuentaAyuda || ''}
          onChange={(e) =>
            updateForm({
              cuentaAyuda: e.target.value as SearchFormData['cuentaAyuda'],
            })
          }
          options={[
            { value: 'Varias personas', label: 'Varias personas' },
            { value: '1-2 personas', label: '1-2 personas' },
            { value: 'Solo', label: 'Solo' },
          ]}
          error={errors.cuentaAyuda}
        />
      </div>

      <div id="que-hay-cerca">
        <TextArea
          id="que-hay-cerca"
          label="¿Qué hay cerca del lugar?"
          placeholder="Parques, escuelas, zonas comerciales, ríos..."
          value={formData.queHayCerca || ''}
          maxLength={200}
          onChange={(e) => updateForm({ queHayCerca: e.target.value })}
          error={errors.queHayCerca}
        />
      </div>

      <div id="animales-callejeros">
        <Select
          id="animales-callejeros"
          label="¿Hay animales callejeros?"
          value={formData.animalesCallejeros || ''}
          onChange={(e) =>
            updateForm({
              animalesCallejeros: e.target
                .value as SearchFormData['animalesCallejeros'],
            })
          }
          options={[
            { value: 'Muchos', label: 'Muchos' },
            { value: 'Pocos', label: 'Pocos' },
            { value: 'Ninguno', label: 'Ninguno' },
            { value: 'No se', label: 'No sé' },
          ]}
          error={errors.animalesCallejeros}
        />
      </div>

      <div id="nivel-trafico">
        <Select
          id="nivel-trafico"
          label="Nivel de tráfico vehicular"
          value={formData.nivelTrafico || ''}
          onChange={(e) =>
            updateForm({
              nivelTrafico: e.target.value as SearchFormData['nivelTrafico'],
            })
          }
          options={[
            { value: 'Alto', label: 'Alto' },
            { value: 'Medio', label: 'Medio' },
            { value: 'Bajo', label: 'Bajo' },
          ]}
          error={errors.nivelTrafico}
        />
      </div>

      <div id="familiaridad-zona">
        <Select
          id="familiaridad-zona"
          label="¿Qué tan familiar es la zona?"
          value={formData.familiaridadZona || ''}
          onChange={(e) =>
            updateForm({
              familiaridadZona: e.target
                .value as SearchFormData['familiaridadZona'],
            })
          }
          options={[
            { value: 'Muy familiar', label: 'Muy familiar' },
            { value: 'Poco', label: 'Poco' },
            { value: 'Nada', label: 'Nada' },
          ]}
          error={errors.familiaridadZona}
        />
      </div>
    </section>
  );
};
