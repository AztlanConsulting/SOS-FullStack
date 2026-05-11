import { Input } from '@shared/components/ui/Input';
import { Select } from '@shared/components/ui/Select';
import type { SearchFormData } from '../../types/searchForm.types';

export interface BasicPetInfoSectionProps {
  formData: Partial<SearchFormData>;
  updateForm: (newData: Partial<SearchFormData>) => void;
  errors: Record<string, string>;
}

export const BasicPetInfoSection = ({
  formData,
  updateForm,
  errors,
}: BasicPetInfoSectionProps) => {
  return (
    <section
      id="basic-pet-info-section"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5 py-4"
    >
      <div id="especie-section">
        <Select
          id="especie-section"
          label="Especie"
          value={formData.especie || ''}
          onChange={(e) =>
            updateForm({ especie: e.target.value as SearchFormData['especie'] })
          }
          options={[
            { value: 'Perro', label: 'Perro' },
            { value: 'Gato', label: 'Gato' },
            { value: 'Otro', label: 'Otro' },
          ]}
          error={errors.especie}
        />
      </div>

      <div id="tamano-section">
        <Select
          id="tamano-section"
          label="Tamaño"
          value={formData.tamano || ''}
          onChange={(e) =>
            updateForm({ tamano: e.target.value as SearchFormData['tamano'] })
          }
          options={[
            { value: 'Pequeno', label: 'Pequeño' },
            { value: 'Mediano', label: 'Mediano' },
            { value: 'Grande', label: 'Grande' },
          ]}
          error={errors.tamano}
        />
      </div>

      <div id="edad-section">
        <Input
          id="edad-section"
          label="Edad aproximada (años)"
          type="number"
          value={
            formData.edadAproximada === ''
              ? ''
              : String(formData.edadAproximada)
          }
          onChange={(e) => {
            const val = e.target.value;
            updateForm({
              edadAproximada: val === '' ? '' : Math.max(0, parseInt(val)),
            });
          }}
          hasLength={false}
          error={errors.edadAproximada}
        />
      </div>

      <div id="sexo-section">
        <Select
          id="sexo-section"
          label="Sexo"
          value={formData.sexo || ''}
          onChange={(e) =>
            updateForm({ sexo: e.target.value as SearchFormData['sexo'] })
          }
          options={[
            { value: 'Macho', label: 'Macho' },
            { value: 'Hembra', label: 'Hembra' },
          ]}
          error={errors.sexo}
        />
      </div>

      <div id="esterilizado-section">
        <Select
          id="esterilizado-section"
          label="¿Está esterilizado?"
          value={formData.esterilizado}
          onChange={(e) =>
            updateForm({
              esterilizado: e.target.value as SearchFormData['esterilizado'],
            })
          }
          options={[
            { value: 'Si', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
        />
      </div>

      <div id="collar-section">
        <Select
          id="collar-section"
          label="¿Tiene collar o placa identificadora?"
          value={formData.collarPlaca}
          onChange={(e) =>
            updateForm({
              collarPlaca: e.target.value as SearchFormData['collarPlaca'],
            })
          }
          options={[
            { value: 'Si', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
        />
      </div>

      <div id="condicion-fisica">
        <Input
          id="condicion-fisica"
          label="¿Tiene alguna condición física visible?"
          value={formData.condicionFisica || ''}
          maxLength={100}
          onChange={(e) => updateForm({ condicionFisica: e.target.value })}
          error={errors.condicionFisica}
        />
      </div>
    </section>
  );
};
