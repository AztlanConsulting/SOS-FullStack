import type { Meta, StoryObj } from '@storybook/react';
import { poster } from './poster.component';
import type { PetReportData } from '../types/PetReportData.types';
import dog1 from '@assets/images/dog1.png';
import dog2 from '@assets/images/dog2.png';

const urlToFile = async (url: string, filename: string): Promise<File> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const file1 = await urlToFile(dog1, 'dog1.jpg');
const file2 = await urlToFile(dog2, 'dog2.jpg');

const mockPetReportData: PetReportData = {
  name: 'Travieso',
  species: 'Perro',
  date: '2026-04-23',
  breed: 'Pastor Suizo',
  sex: 'Macho',
  color: 'Blanco con manchas café',
  size: 'Mediana: 11 a 25 kg',
  description:
    'Es amigable pero puede estar asustado. Tiene una mancha café en la oreja izquierda y llevaba un collar azul.',
  images: [file1, file2],
  imageLayout: '2',
  address: 'Rancho Nuevo, Querétaro, México',
  location: {
    coords: [-100.3899, 20.5888],
    displayName: 'Rancho Nuevo, Querétaro, México',
  },
  locationCoords: [-100.3899, 20.5888],
  contactName: 'Juan Pérez',
  phoneNumber: '+52 442 123 4567',
  email: 'juan.perez@email.com',
};

const meta: Meta<typeof poster> = {
  title: 'Components/Poster',
  component: poster,
};

export default meta;

type Story = StoryObj<typeof poster>;

export const Default: Story = {
  args: {
    pet: mockPetReportData,
  },
};
