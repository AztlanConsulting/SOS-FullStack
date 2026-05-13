import type { SearchFormReport } from '@domain/models/searchForm.model';
import type {
  SearchFormRepository,
  SearchFormResult,
} from '@domain/repositories/searchFrom.respository';

export const createSearchForm = async (
  searchFormRepository: SearchFormRepository,
  data: SearchFormReport,
): Promise<SearchFormResult> => {
  return await searchFormRepository.createSearchForm(data);
};
