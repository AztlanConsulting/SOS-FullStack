import type { UseQueryResult } from '@tanstack/react-query';

export interface PetInfo {
  refId: string;
  image: string;
  species: string;
  color: string;
  location: string;
  details: string;
}

export interface PetInfoDetailed extends PetInfo {
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
  image: string;

  contactName: string;
  phoneNumber: string;
  email: string;
}

export interface PetFilter {
  color: string;
  location: string;
  species: string;
}

export type PetCollectionQuery = UseQueryResult<PetInfo[] | null, Error>;
