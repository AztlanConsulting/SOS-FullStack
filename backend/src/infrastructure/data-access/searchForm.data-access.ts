import type { SearchFormReport } from '@domain/models/searchForm.model';
import { SearchFormModel } from '@domain/models/searchForm.model';
import type {
  SearchFormRepository,
  SearchFormResult,
} from '@domain/repositories/searchFrom.respository';

/**
 * Data access layer for Search Form reports.
 * Handles CRUD operations with MongoDB via Mongoose.
 * Implements SearchFormRepository interface.
 */
export const SearchFormDataAccess: SearchFormRepository = {
  /**
   * Creates a new search form report.
   * @param searchFormData - The data for the new search form report.
   * @returns The created report as SearchFormResult.
   */
  async createSearchForm(
    searchFormData: SearchFormReport,
  ): Promise<SearchFormResult> {
    const created = await SearchFormModel.create(searchFormData);
    return created.toObject() as unknown as SearchFormResult;
  },
};
