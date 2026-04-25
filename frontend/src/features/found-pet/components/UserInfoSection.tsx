import { Input } from '@shared/components/ui/Input';
import { Select } from '@shared/components/ui/Select';
import { TextArea } from '@shared/components/ui/TextArea';
import { DateInput } from '@shared/components/ui/DateInput';
import { FileUpload } from '@shared/components/ui/FileUpload';
import type { PetReportData, ReportType } from '../types/petReport.types';

export interface UsuerInfoSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
  reportType?: ReportType;
}

export const UserInfoSection = ({
  formData,
  updateForm,
  reportType = 'lost',
}: UsuerInfoSectionProps) => {
  const speciesOptions = [
    { value: 'Perro', label: 'Perro' },
    { value: 'Gato', label: 'Gato' },
    { value: 'Ave', label: 'Ave' },
    { value: 'Hámster', label: 'Hámster' },
    { value: 'Conejo', label: 'Conejo' },
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
    <section>
      <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
        <Select
          id="petSpecies"
          label="Especie de la mascota"
          value={formData.species || ''}
          onChange={(e) => updateForm({ species: e.target.value })}
          options={speciesOptions}
        />

        <DateInput
          id="petDate"
          label={
            reportType === 'lost' ? 'Fecha de extravío' : 'Fecha de encuentro'
          }
          value={formData.date || ''}
          onChange={(e) => updateForm({ date: e.target.value })}
          max={today}
        />

        <Input
          id="petBreed"
          label="Raza/tipo de la mascota"
          value={formData.breed || ''}
          onChange={(e) => updateForm({ breed: e.target.value })}
        />

        <Select
          id="petSex"
          label="Sexo de la mascota"
          value={formData.sex || ''}
          onChange={(e) => updateForm({ sex: e.target.value as any })}
          options={sexOptions}
        />

        <Input
          id="petColor"
          label="Color de la mascota"
          value={formData.color || ''}
          onChange={(e) => updateForm({ color: e.target.value })}
        />

        <Select
          id="petSize"
          label="Talla de la mascota"
          value={formData.size || ''}
          onChange={(e) => updateForm({ size: e.target.value as any })}
          options={sizeOptions}
        />

        {reportType === 'lost' && (
          <TextArea
            id="petDescription"
            label="Descripción adicional de la mascota"
            placeholder="Ejemplo: Hembra blanca con patas negras y nariz rosita, esterilizada"
            value={formData.description || ''}
            onChange={(e) => updateForm({ description: e.target.value })}
            maxLength={200}
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
      </div>
    </section>
  );
};
