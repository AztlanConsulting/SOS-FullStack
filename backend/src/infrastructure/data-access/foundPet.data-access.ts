import type { FoundPetReport } from '@domain/models/foundPet.model';
import { FoundPetModel } from '@domain/models/foundPet.model';
import type {
  FoundPetRepository,
  FoundPetResult,
} from '@domain/repositories/foundPet.repository';

/**
 * Data access layer for Found Pet reports.
 * Handles CRUD operations with MongoDB via Mongoose.
 * Implements FoundPetRepository interface.
 */
export const FoundPetDataAccess: FoundPetRepository = {
  /**
   * Creates a new found pet report.
   * @param foundPetData - The data for the new found pet report.
   * @returns The created report as FoundPetResult.
   */
  async createFoundPet(foundPetData: FoundPetReport): Promise<FoundPetResult> {
    const created = await FoundPetModel.create(foundPetData);
    return created.toObject() as unknown as FoundPetResult;
  },

  /**
   * Finds a found pet report by its ID.
   * @param id - The ID of the report to find.
   * @returns The found report as FoundPetResult, or null if not found.
   */
  async getFoundPetById(id: string): Promise<FoundPetResult | null> {
    const found = await FoundPetModel.findById(id);
    return found?.toObject() as unknown as FoundPetResult | null;
  },

  /**
   * Retrieves all found pet reports.
   * @returns An array of all found pet reports.
   */
  async getAllFoundPets(): Promise<FoundPetResult[]> {
    return FoundPetModel.find() as Promise<FoundPetResult[]>;
  },

  /**
   * Updates a found pet report by its ID.
   * @param id - The ID of the report to update.
   * @param foundPetData - The partial data to update.
   * @returns The updated report as FoundPetResult, or null if not found.
   */
  async updateFoundPet(
    id: string,
    foundPetData: Partial<FoundPetReport>,
  ): Promise<FoundPetResult | null> {
    const updated = await FoundPetModel.findByIdAndUpdate(id, foundPetData, {
      new: true,
    });
    return updated?.toObject() as unknown as FoundPetResult | null;
  },

  /**
   * Deletes a found pet report by its ID.
   * @param id - The ID of the report to delete.
   * @returns True if the report was deleted, false otherwise.
   */
  async deleteFoundPet(id: string): Promise<boolean> {
    const deleted = await FoundPetModel.findByIdAndDelete(id);
    return deleted !== null;
  },
};
