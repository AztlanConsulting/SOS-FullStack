import { Input } from '@shared/components/ui/Input';
import { Select } from '@shared/components/ui/Select';
import { Text } from '@shared/components/ui/Text';
import type { SearchFormData } from '../types/searchForm.types';

export interface BasicPetInfoSectionProps {
  formData: Partial<SearchFormData>;
  updateForm: (newData: Partial<SearchFormData>) => void;
  errors: Record<string, string>;
}

const ToggleSwitch = ({
  label,
  checked,
  onChange,
  id,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  id: string;
}) => (
  <div className="flex flex-col w-full">
    <Text variant="caption" weight="medium" className="text-gray-700 mb-2">
      {label}
    </Text>
    <div className="flex items-center gap-3 p-3 border border-gray-400 rounded-lg">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-yellow-400' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <Text variant="caption" weight="regular" className="text-gray-700">
        {checked ? 'Sí' : 'No'}
      </Text>
    </div>
  </div>
);

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
        <ToggleSwitch
          id="esterilizado-section"
          label="¿Está esterilizado?"
          checked={formData.esterilizado || false}
          onChange={(val) => updateForm({ esterilizado: val })}
        />
      </div>

      <div id="collar-section">
        <ToggleSwitch
          id="collar-section"
          label="¿Tiene collar o placa identificadora?"
          checked={formData.collarPlaca || false}
          onChange={(val) => updateForm({ collarPlaca: val })}
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
