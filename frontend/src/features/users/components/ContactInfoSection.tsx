import type { FoundPetReportData } from '@/shared/types/petReport.types';
import { Input } from '@shared/components/ui/Input/Input';
import { PhoneInput } from '@shared/components/ui/PhoneInput/PhoneInput';

export interface ContactInfoSectionProps<T extends FoundPetReportData> {
  formData: Partial<T>;
  updateForm: (newData: Partial<T> | Partial<FoundPetReportData>) => void;
  errors: Record<string, string>;
  owner?: boolean;
}

export const ContactInfoSection = <T extends FoundPetReportData>({
  formData,
  updateForm,
  errors,
  owner = true,
}: ContactInfoSectionProps<T>) => {
  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col py-4">
      <div className="flex flex-col gap-4 w-full max-w-lg items-center mx-auto">
        <Input
          id="ownerName"
          label={`Nombre y apellido del ${owner ? 'dueño' : 'para contactarte'}`}
          hasLength={false}
          value={formData.contactName || ''}
          onChange={(e) => updateForm({ contactName: e.target.value })}
          error={errors.contactName}
        />

        <PhoneInput
          label="Número de teléfono"
          id="ownerPhone"
          value={formData.phoneNumber || ''}
          onChange={(value) => updateForm({ phoneNumber: value })}
          error={errors.phoneNumber}
        />

        <Input
          id="ownerEmail"
          label="Correo electrónico"
          type="email"
          hasLength={false}
          value={formData.email || ''}
          onChange={(e) => updateForm({ email: e.target.value })}
          error={errors.email}
        />
      </div>
    </section>
  );
};
