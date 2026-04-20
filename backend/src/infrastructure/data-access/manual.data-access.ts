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
   * Retrieves a paginated list of manuals from the database.
   * Supports filtering by search term and sorting by various criteria.
   * @param manualRequest - Object containing page index (0-based), searchTerm (partial match), and sortOption
   * @returns Promise resolving to an array of ManualResult objects
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
   * Retrieves the total count of manuals matching the optional search criteria.
   * Used for calculating pagination metadata and validating page ranges.
   * @param manualRequest - Object optionally containing searchTerm to filter count results
   * @returns Promise resolving to the total number of matching manuals
   */

  async getTotalManuals(manualRequest: GetManual): Promise<number> {
    const { searchTerm } = manualRequest;
    let query = ManualModel.find();

    if (searchTerm != null && searchTerm.trim().length > 0) {
      query = query.where('name').regex(new RegExp(searchTerm, 'i'));
    }

    const totalManuals = await query.countDocuments();
    return totalManuals;
  },

  /**
   * Retrieves a single manual document by its MongoDB ObjectId.
   * @param id - The MongoDB ObjectId of the manual to fetch
   * @returns Promise resolving to the ManualResult object, or null if no manual exists with that ID
   */

  async getManualById(id: string): Promise<ManualResult | null> {
    return await ManualModel.findById(id);
  },
};
