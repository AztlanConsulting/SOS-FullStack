import { Input } from '@shared/components/ui/Input/Input';
import { PhoneInput } from '@shared/components/ui/PhoneInput/PhoneInput';
import type { PetReportData } from '../types/petReport.types';

export interface ContactInfoSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
}

export const ContactInfoSection = ({
  formData,
  updateForm,
}: ContactInfoSectionProps) => {
  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6 py-4">
      <h3 className="text-xl font-bold text-center mb-2">
        Información del dueño
      </h3>

      <div className="flex flex-col gap-4">
        <Input
          label="Nombre y apellido del dueño"
          value={formData.contactName || ''}
          onChange={(e) => updateForm({ contactName: e.target.value })}
        />

        <PhoneInput
          label="Número de teléfono"
          value={formData.phoneNumber || ''}
          onChange={(value) => updateForm({ phoneNumber: value })}
        />

        <Input
          label="Correo electrónico"
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateForm({ email: e.target.value })}
        />
      </div>
    </section>
  );
};
