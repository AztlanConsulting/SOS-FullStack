import type { Pet } from '@domain/models/pet.model';

export interface PetRepository {
  createPet(petData: Partial<Pet>): Promise<Pet>;
}
