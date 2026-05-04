import type { UseQueryResult } from '@tanstack/react-query';

export interface PetInfo {
  image: string;
  species: string;
  name?: string;
  // location: string;
}

export type PetCollectionQuery = UseQueryResult<PetInfo[] | null, Error>;
