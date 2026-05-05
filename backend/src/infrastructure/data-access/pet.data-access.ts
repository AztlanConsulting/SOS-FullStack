import { PetModel } from '@domain/models/pet.model';
import type { Pet, PetCreateInput } from '@domain/models/pet.model';
import type { PetRepository } from '@domain/repositories/pet.repository';

export const petDataAccess: PetRepository = {
  /**
   * Creates a new pet in the database.
   *
   * @param petData - Data required to create the pet (excluding id and timestamps)
   * @returns The created pet as a plain JavaScript object
   */
  createPet: async function (petData: PetCreateInput): Promise<Pet> {
    const newPet = new PetModel(petData);
    const savedPet = await newPet.save();
    return savedPet.toObject() as Pet;
  },

  /**
   * Get the pet of an user by his id.
   *
   * @param userId - The user ID.
   * @returns The pet of the user.
   */
  getPetByUserId: async function (userId: string): Promise<Pet | null> {
    const pet = await PetModel.findOne({ userId }).lean();
    return pet as Pet | null;
  },
};
