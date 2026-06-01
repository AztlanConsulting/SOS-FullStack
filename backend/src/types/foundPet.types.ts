import type { FoundPetRepository } from '@/domain/repositories/foundPet.repository';
import type { PetVectorRepository } from '@/domain/repositories/petImage.repository';
import z from 'zod';

export interface GetPetRepositories {
  foundPetRepository: FoundPetRepository;
  petVector: PetVectorRepository;
}

export interface PetInfoDetailed {
  refId: string;
  image: string;
  species: string;
  location: string;
  details: string;
  date: string;
  sex: '' | 'Macho' | 'Hembra' | 'Desconocido';
  color: string;
  breed: string;
  size:
    | ''
    | 'Mini: 1 a 4 kg'
    | 'Pequeña: 5 a 10 kg'
    | 'Mediana: 11 a 25 kg'
    | 'Grande: 26 a 45 kg'
    | 'Gigante: más de 45 kg';

  contactName: string;
  phoneNumber: string;
  email: string;
}

const species = ['Perro', 'Gato', 'Ave', 'Otro'];
const sex = ['Macho', 'Hembra', 'Desconocido'];
const size = [
  'Mini: 1 a 4 kg',
  'Pequeña: 5 a 10 kg',
  'Mediana: 11 a 25 kg',
  'Grande: 26 a 45 kg',
  'Gigante: más de 45 kg',
];

const phone = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

export const foundPet = z.object({
  species: z.enum(species),
  date: z.string(),
  breed: z.string().max(40, 'breed too long'),
  sex: z.enum(sex),
  color: z.string().max(40, 'breed too long'),
  description: z.string().max(200, 'description too long').optional(),
  size: z.enum(size),
  location: z.string(),
  locationCoords: z.tuple([z.number(), z.number()]),
  contactName: z.string().max(40, 'name too long'),
  phoneNumber: z.string().regex(phone),
  email: z.email('Not an email'),
  images: z.array(z.string()).refine((base64) => {
    try {
      if (base64.length !== 1) return 0;

      const cleaned = base64[0].replace(/^data:image\/\w+;base64,/, '');

      const buffer = Buffer.from(cleaned, 'base64');

      return buffer.length <= 5000000;
    } catch {
      return false;
    }
  }, 'Image must be smaller than 5MB'),
});
