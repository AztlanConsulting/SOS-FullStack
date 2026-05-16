import { PetModel } from '@domain/models/pet.model';
import type { Pet, PetCreateInput } from '@domain/models/pet.model';
import type { PetRepository } from '@domain/repositories/pet.repository';
import { Types } from 'mongoose';

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
   * Gets a pet by its ID
   *
   * @param petId - The ID of the pet
   * @returns The pet if found, otherwise null
   */
  async getPetById(petId: string): Promise<Pet | null> {
    if (!Types.ObjectId.isValid(petId)) {
      return null;
    }

    const pet = await PetModel.findById(petId);

    return pet ? (pet.toObject() as Pet) : null;
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
