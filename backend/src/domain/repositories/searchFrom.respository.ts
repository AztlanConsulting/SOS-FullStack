import type { Types } from 'mongoose';
import type { SearchFormReport } from '@domain/models/searchForm.model';

export interface SearchFormResult extends SearchFormReport {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFormRepository {
  createSearchForm(searchFormData: SearchFormReport): Promise<SearchFormResult>;
}
