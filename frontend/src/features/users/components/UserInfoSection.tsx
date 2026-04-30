import { Input } from '@shared/components/ui/Input';
import { Select } from '@shared/components/ui/Select';
import { TextArea } from '@shared/components/ui/TextArea';
import { DateInput } from '@shared/components/ui/DateInput';
import { FileUpload } from '@shared/components/ui/FileUpload';
import type {
  LostPetReportData,
  ReportType,
} from '@shared/types/petReport.types';

export interface UsuerInfoSectionProps {
  formData: Partial<LostPetReportData>;
  updateForm: (newData: Partial<LostPetReportData>) => void;
  reportType?: ReportType;
  errors: Record<string, string>;
}

export const UserInfoSection = ({
  formData,
  updateForm,
  reportType = 'lost',
  errors,
}: UsuerInfoSectionProps) => {
  const speciesOptions = [
    { value: 'Perro', label: 'Perro' },
    { value: 'Gato', label: 'Gato' },
    { value: 'Ave', label: 'Ave' },
    { value: 'Otro', label: 'Otro' },
  ];

  const sexOptions = [
    { value: 'Macho', label: 'Macho' },
    { value: 'Hembra', label: 'Hembra' },
    { value: 'Desconocido', label: 'Desconocido' },
  ];

  const sizeOptions = [
    { value: 'Mini: 1 a 4 kg', label: 'Mini: 1 a 4 kg' },
    { value: 'Pequeña: 5 a 10 kg', label: 'Pequeña: 5 a 10 kg' },
    { value: 'Mediana: 11 a 25 kg', label: 'Mediana: 11 a 25 kg' },
    { value: 'Grande: 26 a 45 kg', label: 'Grande: 26 a 45 kg' },
    { value: 'Gigante: más de 45 kg', label: 'Gigante: más de 45 kg' },
  ];

  const today = new Date().toLocaleDateString('en-CA');

  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5 py-4">
      {/* Name only applies when is a report for a lost pet. */}
      {reportType === 'lost' && (
        <Input
          id="petName"
          label="Nombre de la mascota"
          value={formData.name || ''}
          hasLength={false}
          onChange={(e) => updateForm({ name: e.target.value })}
          error={errors.name}
        />
      )}

      <Select
        id="petSpecies"
        label="Especie de la mascota"
        value={formData.species || ''}
        onChange={(e) => updateForm({ species: e.target.value })}
        options={speciesOptions}
        error={errors.species}
      />

      <DateInput
        id="petDate"
        label={
          reportType === 'lost' ? 'Fecha de extravío' : 'Fecha de encuentro'
        }
        value={formData.date || ''}
        onChange={(e) => updateForm({ date: e.target.value })}
        max={today}
        error={errors.date}
      />

      <Input
        id="petBreed"
        label="Raza/tipo de la mascota"
        value={formData.breed || ''}
        maxLength={40}
        onChange={(e) => updateForm({ breed: e.target.value })}
        error={errors.breed}
      />

      <Select
        id="petSex"
        label="Sexo de la mascota"
        value={formData.sex || ''}
        onChange={(e) => updateForm({ sex: e.target.value as any })}
        options={sexOptions}
        error={errors.sex}
      />

      <Input
        id="petColor"
        label="Color de la mascota"
        value={formData.color || ''}
        maxLength={40}
        onChange={(e) => updateForm({ color: e.target.value })}
        error={errors.color}
      />

      <Select
        id="petSize"
        label="Talla de la mascota"
        value={formData.size || ''}
        onChange={(e) => updateForm({ size: e.target.value as any })}
        options={sizeOptions}
        error={errors.size}
      />

      {reportType === 'lost' && (
        <TextArea
          id="petDescription"
          label="Descripción adicional de la mascota"
          placeholder="Ejemplo: Hembra blanca con patas negras y nariz rosita, esterilizada"
          value={formData.description || ''}
          onChange={(e) => updateForm({ description: e.target.value })}
          maxLength={100}
        />
      )}

      {reportType === 'found' && (
        <div className="mt-2">
          <FileUpload
            index={1}
            onChange={(file) => console.log('Archivo cargado:', file)}
          />
        </div>
      )}
    </section>
  );
};
