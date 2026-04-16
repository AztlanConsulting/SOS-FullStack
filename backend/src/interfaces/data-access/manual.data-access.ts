import type {
  ManualRepository,
  GetManual,
  ManualResult,
} from '@domain/repositories/manual.repository';
import { ManualModel } from '@domain/models/manual.model';
import type { SortOrder } from 'mongoose';

const limit = 6;
export const ManualDataAccess: ManualRepository = {
  /**
   * Retrieve all manuals from the database.
   * @param manualRequest - page, searchTerm, and sortOption for filtering and pagination
   * @returns Array of manual results
   */
  async getManuals({
    page = 0,
    sortOption,
    searchTerm,
  }: GetManual): Promise<ManualResult[]> {
    const sort: Record<string, { [key: string]: SortOrder }> = {
      'Nombre (A-Z)': { name: 1 },
      'Nombre (Z-A)': { name: -1 },
      'Precio: menor a mayor': { price: 1 },
      'Precio: mayor a menor': { price: -1 },
    };

    const manuals = await ManualModel.find({
      name: { $regex: searchTerm, $options: 'i' },
    })
      .skip(page * limit)
      .limit(limit)
      .sort(sort[sortOption])
      .exec();
    return manuals;
  },

  /**
   * Get the total amount of manuals for pagination
   * @returns number of records
   */
  async getTotalManuals(manualRequest: GetManual): Promise<number> {
    const { searchTerm } = manualRequest;
    let query = ManualModel.find();

    if (searchTerm) {
      query = query.where('name').regex(new RegExp(searchTerm, 'i'));
    }

    const totalManuals = await query.countDocuments();
    return totalManuals;
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
