import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PetInfoSection } from './PetInfoSection';
import type { PetReportData } from '../types/petReport.types';

const meta: Meta<typeof PetInfoSection> = {
  title: 'Features/Pets/PetInfoSection', // Esto creará una carpeta separada de tus UI base
  component: PetInfoSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PetInfoSection>;

// Componente contenedor para manejar el estado interactivo en Storybook
const InteractiveWrapper = ({
  reportType,
}: {
  reportType: 'lost' | 'found';
}) => {
  const [data, setData] = useState<Partial<PetReportData>>({});

  const handleUpdateField = (field: keyof PetReportData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900 flex flex-col items-center">
      {/* Tu componente ensamblado */}
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <PetInfoSection
          data={data}
          updateField={handleUpdateField}
          reportType={reportType}
        />
      </div>

      {/* Visualizador de estado (Solo para que veas cómo se guarda la info en tiempo real) */}
      <div className="mt-8 p-4 bg-gray-800 text-green-400 rounded-lg w-full max-w-md overflow-auto">
        <p className="text-xs text-gray-400 mb-2">
          // Objeto que se enviará al componente padre:
        </p>
        <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

// Historia 1: Simulando el flujo de Mascota Perdida
export const LostPetFlow: Story = {
  render: () => <InteractiveWrapper reportType="lost" />,
};

// Historia 2: Simulando el flujo de Mascota Encontrada
export const FoundPetFlow: Story = {
  render: () => <InteractiveWrapper reportType="found" />,
};
