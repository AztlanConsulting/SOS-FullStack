import type { Meta, StoryObj } from '@storybook/react';
import { Poster } from '@features/poster/components/Poster.component';
import dog1 from '@assets/images/dog1.png';
import dog2 from '@assets/images/dog2.png';
import husky1 from '@assets/images/husky1.jpg';
import husky2 from '@assets/images/husky2.jpg';
import husky3 from '@assets/images/husky3.jpg';
import husky4 from '@assets/images/husky4.jpg';
import type { LostPetReportData } from '@/shared/types/petReport.types';

const urlToFile = async (url: string, filename: string): Promise<File> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const file1 = await urlToFile(dog1, 'dog1.jpg');
const file2 = await urlToFile(dog2, 'dog2.jpg');
const file3 = await urlToFile(husky1, 'husky1.jpg');
const file4 = await urlToFile(husky2, 'husky2.jpg');
const file5 = await urlToFile(husky3, 'husky3.jpg');
const file6 = await urlToFile(husky4, 'husky4.jpg');

const mockPetReportData: LostPetReportData = {
  name: 'Travieso',
  species: 'Perro',
  date: '2026-04-23',
  breed: 'Mixto de husky y galgo italinno y shitzu',
  sex: 'Macho',
  color: 'Es blanco y negro y 3 manchas amarillas.',
  size: 'Mediana: 11 a 25 kg',
  description:
    'Es amigable pero puede estar asustado. Tiene una mancha café en la oreja izquierda y llevaba collar.',
  images: [file4],
  imageLayout: '1',
  address:
    'Tertiary Road Lateral Bernardo Quintana, Residencial Bellavista, Delegación Epigmenio González, Querétaro, Municipio de Querétaro, Querétaro, 73130, Mexico',
  location: {
    coords: [-100.3899, 20.5888],
    displayName: 'Rancho Nuevo, Querétaro, México',
  },
  locationCoords: [-100.3899, 20.5888],
  contactName: 'Juan Pérez',
  phoneNumber: '+52 442 123 4567',
  email: 'juan.perez@email.com',
  planName: 'Plan Básico',
};

const meta: Meta<typeof Poster> = {
  title: 'Components/Poster',
  component: Poster,
};

export default meta;

type Story = StoryObj<typeof Poster>;

export const Default: Story = {
  args: {
    pet: mockPetReportData,
  },
};
