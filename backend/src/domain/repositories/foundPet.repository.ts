import type { FoundPetReport } from '@domain/models/foundPet.model';

export interface FoundPetResult extends FoundPetReport {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoundPetRepository {
  createFoundPet(foundPetData: FoundPetReport): Promise<FoundPetResult>;
  getFoundPetById(id: string): Promise<FoundPetResult | null>;
  getAllFoundPets(): Promise<FoundPetResult[]>;
  updateFoundPet(
    id: string,
    foundPetData: Partial<FoundPetReport>,
  ): Promise<FoundPetResult | null>;
  deleteFoundPet(id: string): Promise<boolean>;
}
