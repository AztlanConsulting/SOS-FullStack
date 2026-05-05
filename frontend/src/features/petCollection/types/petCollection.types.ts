import type { UseQueryResult } from '@tanstack/react-query';

export interface PetInfo {
  refId: string;
  image: string;
  species: string;
  location: string;
  details: string;
}

export type PetCollectionQuery = UseQueryResult<PetInfo[] | null, Error>;
