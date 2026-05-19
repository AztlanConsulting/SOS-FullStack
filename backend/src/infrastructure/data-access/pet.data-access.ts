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
   * Get the pets of a user by id, newest first.
   *
   * @param userId - The user ID.
   * @returns The pets of the user.
   */
  getPetsByUserId: async function (userId: string): Promise<Pet[]> {
    const pets = await PetModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return pets as Pet[];
  },
};
