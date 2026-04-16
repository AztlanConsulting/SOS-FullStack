// import { Input } from '../../../shared/components/ui/Input';
import { Input } from '@shared/components/ui/Input';
import { Select } from '@shared/components/ui/Select';
import { TextArea } from '@shared/components/ui/TextArea';
import { DateInput } from '@shared/components/ui/DateInput';
import { FileUpload } from '@shared/components/ui/FileUpload';
import type { PetReportData, ReportType } from '../types/petReport.types';

interface PetInfoSectionProps {
  data: Partial<PetReportData>;
  updateField: (field: keyof PetReportData, value: string) => void;
  reportType: ReportType;
}

export const PetInfoSection = ({
  data,
  updateField,
  reportType,
}: PetInfoSectionProps) => {
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
    { value: 'Pequeña', label: 'Pequeña' },
    { value: 'Mediana', label: 'Mediana' },
    { value: 'Grande', label: 'Grande' },
  ];

  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5">
      {/* RENDERIZADO CONDICIONAL: Solo aparece si está perdida */}
      {reportType === 'lost' && (
        <Input
          id="petName"
          label="Nombre de la mascota"
          value={data.name || ''}
          onChange={(e) => updateField('name', e.target.value)}
        />
      )}

      <Select
        id="petSpecies"
        label="Especie de la mascota"
        value={data.species || ''}
        onChange={(e) => updateField('species', e.target.value)}
        options={speciesOptions}
      />

      <DateInput
        id="petDate"
        label={
          reportType === 'lost' ? 'Fecha de extravío' : 'Fecha de encuentro'
        }
        value={data.date || ''}
        onChange={(e) => updateField('date', e.target.value)}
      />

      <Input
        id="petBreed"
        label="Raza/tipo de la mascota"
        value={data.breed || ''}
        onChange={(e) => updateField('breed', e.target.value)}
      />

      <Select
        id="petSex"
        label="Sexo de la mascota"
        value={data.sex || ''}
        onChange={(e) => updateField('sex', e.target.value)}
        options={sexOptions}
      />

      <Input
        id="petColor"
        label="Color de la mascota"
        value={data.color || ''}
        onChange={(e) => updateField('color', e.target.value)}
      />

      <Select
        id="petSize"
        label="Talla de la mascota"
        value={data.size || ''}
        onChange={(e) => updateField('size', e.target.value)}
        options={sizeOptions}
      />

      {/* RENDERIZADO CONDICIONAL: Solo aparece si está perdida */}
      {reportType === 'lost' && (
        <TextArea
          id="petDescription"
          label="Descripción adicional de la mascota"
          placeholder="Ejemplo: Hembra blanca con patas negras y nariz rosita, esterilizada"
          value={data.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
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
    </section>
  );
};
