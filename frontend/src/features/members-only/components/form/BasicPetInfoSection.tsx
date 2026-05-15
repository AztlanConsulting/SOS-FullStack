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
      <div id="species-section">
        <Select
          id="species-section"
          label="Especie"
          value={formData.species || ''}
          onChange={(e) =>
            updateForm({ species: e.target.value as SearchFormData['species'] })
          }
          options={[
            { value: 'Dog', label: 'Perro' },
            { value: 'Cat', label: 'Gato' },
            { value: 'Other', label: 'Otro' },
          ]}
          error={errors.species}
        />
      </div>

      <div id="size-section">
        <Select
          id="size-section"
          label="Tamaño"
          value={formData.size || ''}
          onChange={(e) =>
            updateForm({ size: e.target.value as SearchFormData['size'] })
          }
          options={[
            { value: 'Small', label: 'Pequeño' },
            { value: 'Medium', label: 'Mediano' },
            { value: 'Large', label: 'Grande' },
          ]}
          error={errors.size}
        />
      </div>

      <div id="approximate-age-section">
        <Input
          id="approximate-age-section"
          label="Edad aproximada (años)"
          type="number"
          value={
            formData.approximateAge === ''
              ? ''
              : String(formData.approximateAge)
          }
          onChange={(e) => {
            const val = e.target.value;
            updateForm({
              approximateAge: val === '' ? '' : Math.max(0, parseInt(val)),
            });
          }}
          hasLength={false}
          error={errors.approximateAge}
        />
      </div>

      <div id="sex-section">
        <Select
          id="sex-section"
          label="Sexo"
          value={formData.sex || ''}
          onChange={(e) =>
            updateForm({ sex: e.target.value as SearchFormData['sex'] })
          }
          options={[
            { value: 'Male', label: 'Macho' },
            { value: 'Female', label: 'Hembra' },
          ]}
          error={errors.sex}
        />
      </div>

      <div id="sterilized-section">
        <Select
          id="sterilized-section"
          label="¿Está esterilizado?"
          value={formData.sterilized}
          onChange={(e) =>
            updateForm({
              sterilized: e.target.value as SearchFormData['sterilized'],
            })
          }
          options={[
            { value: 'Yes', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
        />
      </div>

      <div id="collar-tag-section">
        <Select
          id="collar-tag-section"
          label="¿Tiene collar o placa identificadora?"
          value={formData.collarTag}
          onChange={(e) =>
            updateForm({
              collarTag: e.target.value as SearchFormData['collarTag'],
            })
          }
          options={[
            { value: 'Yes', label: 'Sí' },
            { value: 'No', label: 'No' },
          ]}
        />
      </div>

      <div id="physical-condition">
        <Input
          id="physical-condition"
          label="¿Tiene alguna condición física visible?"
          value={formData.physicalCondition || ''}
          maxLength={100}
          onChange={(e) => updateForm({ physicalCondition: e.target.value })}
          error={errors.physicalCondition}
        />
      </div>
    </section>
  );
};
