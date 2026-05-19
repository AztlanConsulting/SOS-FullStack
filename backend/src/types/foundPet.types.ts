import type { FoundPetRepository } from '@/domain/repositories/foundPet.repository';
import type { PetVectorRepository } from '@/domain/repositories/petImage.repository';

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
