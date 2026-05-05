import type { UseQueryResult } from '@tanstack/react-query';

export interface PetInfo {
  refId: string;
  image: string;
  species: string;
  color: string;
  location: string;
  details: string;
}

export interface PetFilter {
  color: string;
  location: string;
  species: string;
}

export type PetCollectionQuery = UseQueryResult<PetInfo[] | null, Error>;
