import type { Pet, PetCreateInput } from '@domain/models/pet.model';

export interface PetRepository {
  createPet(petData: PetCreateInput): Promise<Pet>;
  getPetByUserId(userId: string): Promise<Pet | null>;
}
