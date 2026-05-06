import type { SearchFormReport } from '@domain/models/searchForm.model';

export interface SearchFormResult extends SearchFormReport {
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFormRepository {
  createSearchForm(searchFormData: SearchFormReport): Promise<SearchFormResult>;
}
