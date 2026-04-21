import { PetModel } from '@domain/models/pet.model';
import type { Pet } from '@domain/models/pet.model';
import type { PetRepository } from '@domain/repositories/pet.repository';

export const petDataAccess: PetRepository = {
  createPet: async function (petData: Partial<Pet>): Promise<Pet> {
    const newPet = new PetModel(petData);
    const savedPet = await newPet.save();
    return savedPet.toObject();
  },
};
