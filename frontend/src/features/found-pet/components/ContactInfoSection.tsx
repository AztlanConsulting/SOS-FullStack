import { Input } from '@shared/components/ui/Input/Input';
import { PhoneInput } from '@shared/components/ui/PhoneInput/PhoneInput';
import type { PetReportData } from '../types/petReport.types';
import { Text } from '@shared/components/ui/Text';

export interface ContactInfoSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
}

export const ContactInfoSection = ({
  formData,
  updateForm,
}: ContactInfoSectionProps) => {
  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col py-4">
        <div id="pet-location-section">
            <Text variant="h2" as="h2"weight="bold" className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Información del dueño 
            </Text>
        </div>
      <div className="flex flex-col gap-4">
        <Input
          id="ownerName"
          label="Nombre y apellido del dueño"
          value={formData.contactName || ''}
          onChange={(e) => updateForm({ contactName: e.target.value })}
        />

        <PhoneInput
          label="Número de teléfono"
          id="ownerPhone"
          value={formData.phoneNumber || ''}
          onChange={(value) => updateForm({ phoneNumber: value })}
        />

        <Input
          id="ownerEmail"
          label="Correo electrónico"
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateForm({ email: e.target.value })}
        />
      </div>
    </section>
  );
};
