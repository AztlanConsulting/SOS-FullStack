import { Text } from '@shared/components/ui/Text';
import { Button } from '@shared/components/ui/Button';
import type { SearchFormData } from '../types/searchForm.types';

export interface FilesSubmissionSectionProps {
  formData: Partial<SearchFormData>;
  updateForm: (newData: Partial<SearchFormData>) => void;
  errors: Record<string, string>;
  onSubmit: () => void;
}

export const FilesSubmissionSection = ({
  formData,
  updateForm,
  errors,
  onSubmit,
}: FilesSubmissionSectionProps) => {
  const hasError = Boolean(errors.cartillaVacunacion);
  const fileName = formData.cartillaVacunacion?.name;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateForm({ cartillaVacunacion: file });
  };

  return (
    <section
      id="files-submission-section"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5 py-4"
    >
      <div id="cartilla-upload" className="flex flex-col w-full">
        <Text variant="caption" weight="medium" className="text-gray-700 mb-2">
          Cartilla de vacunación (PDF o imagen, máx 15MB)
        </Text>
        <label
          className={`relative w-full h-12 border rounded-lg bg-white flex items-center justify-center text-gray-700 text-sm font-medium transition-all cursor-pointer active:scale-[0.98] overflow-hidden px-4 ${
            hasError ? 'border-red-500' : 'border-gray-400'
          }`}
        >
          <input
            type="file"
            className="hidden"
            accept=".pdf,image/*"
            onChange={handleFileChange}
          />
          <span className="truncate max-w-[70%]">
            {fileName || 'Subir cartilla de vacunación'}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 text-gray-500 absolute right-4"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </label>
        {errors.cartillaVacunacion && (
          <Text
            variant="small"
            as="small"
            weight="regular"
            className="color-danger ml-1 italic mt-1"
          >
            {errors.cartillaVacunacion}
          </Text>
        )}
      </div>

      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto py-4">
        <div className="w-full flex justify-center [&>button]:w-full [&>button]:max-w-none [&>button]:whitespace-nowrap">
          <Button onClick={onSubmit} label="Enviar" variant="plans" />
        </div>
      </div>
    </section>
  );
};
