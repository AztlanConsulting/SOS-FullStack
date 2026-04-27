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
    <section className="w-full mx-auto flex flex-col gap-8">
      <div id="pet-location-section">
        <Text
          variant="h2"
          as="h2"
          weight="medium"
          className="text-center text-xl md:text-2xl "
        >
          Información de contacto
        </Text>
      </div>
      <div className="w-full max-w-lg mx-auto flex flex-col gap-4">
        <Input
          id="ownerName"
          label="Nombre y apellido"
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
