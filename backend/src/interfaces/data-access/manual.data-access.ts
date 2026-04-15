import type { ManualRepository } from '@domain/repositories/manual.repository';
import type { ManualResult } from '@domain/repositories/manual.repository';
import { ManualModel } from '@domain/models/manual.model';

export const ManualDataAccess: ManualRepository = {
  /**
   * Retrieve all manuals from the database.
   * @returns Array of manual results
   */
  async getManuals(): Promise<ManualResult[]> {
    return await ManualModel.find();
  },
  /**
   * Retrieve a manual by its ID.
   * @param id - The manual ID to search for
   * @returns The manual result or null if not found
   */
  async getManualById(id: string): Promise<ManualResult | null> {
    return await ManualModel.findById(id);
  },
};
