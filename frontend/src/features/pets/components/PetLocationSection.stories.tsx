import type { Meta, StoryObj } from '@storybook/react';
import { PetLocationSection } from './PetLocationSection';
import { useState } from 'react';

const meta: Meta<typeof PetLocationSection> = {
  title: 'Features/Pets/PetLocationSection',
  component: PetLocationSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PetLocationSection>;

// Componente Wrapper para simular el estado del formulario padre
const SectionWrapper = ({
  initialReportType,
}: {
  initialReportType: 'lost' | 'found';
}) => {
  const [formData, setFormData] = useState({});

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    console.log(`[Formulario Padre] Campo actualizado: ${field}`, value);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <PetLocationSection
        data={formData}
        updateField={updateField}
        reportType={initialReportType}
      />
    </div>
  );
};

export const LostPetLocation: Story = {
  render: () => <SectionWrapper initialReportType="lost" />,
};

export const FoundPetLocation: Story = {
  render: () => <SectionWrapper initialReportType="found" />,
};
