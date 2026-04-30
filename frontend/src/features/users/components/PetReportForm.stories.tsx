import type { Meta, StoryObj } from '@storybook/react';
import { PetReportForm } from './PetReportForm';
import type { LostPetReportData } from '@/shared/types/petReport.types';

const meta: Meta<typeof PetReportForm> = {
  title: 'Features/Users/PetReportFlow',
  component: PetReportForm,
  parameters: {
    layout: 'fullscreen',
    // Forzamos a Storybook a usar un fondo claro en su interfaz
    backgrounds: {
      default: 'light',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PetReportForm>;

// --- MOCK DATA ---
const mockDataConfirmacion: Partial<LostPetReportData> = {
  name: 'Chiqui',
  species: 'Perro',
  date: '24/02/2026',
  breed: 'Husky',
  sex: 'Macho',
  color: 'Café y blanco',
  size: 'Grande: 26 a 45 kg',
  description:
    'Su ojo izquierdo es blanco y el derecho es café. Sus patas son de color rosa.',
  images: [],
  imageLayout: '3',
  address: 'Tec de Monterrey Campus Querétaro, Calle Epigmenio González 500',
  contactName: 'Juan Pedro Rodríguez Hernández',
  phoneNumber: '+52 442 123 4567',
  email: 'juan123@gmail.com',
};

// --- HISTORIA 1: Formulario Vacío ---
// Aquí puedes probar cómo un usuario real empezaría desde cero
export const FormularioVacio: Story = {
  render: () => (
    // Agregamos bg-white y text-black para evitar el modo oscuro
    <div className="bg-white min-h-screen w-full text-black py-8">
      <PetReportForm />
    </div>
  ),
};

// --- HISTORIA 2: Flujo Completo (Pre-llenado) ---
// Aquí puedes probar el botón de "Siguiente" y el de "Editar" sin tener que llenar todo
export const FlujoPruebaInteractivo: Story = {
  render: () => (
    <div className="bg-white min-h-screen w-full text-black py-8">
      <PetReportForm initialData={mockDataConfirmacion} />
    </div>
  ),
};
