import { Input } from '@shared/components/ui/Input/Input';
import { PhoneInput } from '@shared/components/ui/PhoneInput/PhoneInput';
import type { PetReportData } from '../types/petReport.types';

export interface ContactInfoSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
  errors: Record<string, string>;
}

export const ContactInfoSection = ({
  formData,
  updateForm,
  errors,
}: ContactInfoSectionProps) => {
  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col py-4">
      <div className="flex flex-col gap-4 w-full max-w-lg items-center mx-auto">
        <Input
          id="ownerName"
          label="Nombre y apellido del dueño"
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
