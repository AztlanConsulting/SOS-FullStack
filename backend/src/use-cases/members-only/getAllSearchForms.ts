import type {
  SearchFormRepository,
  SearchFormWithUser,
} from '@domain/repositories/searchFrom.respository';

export const getAllSearchForms = async (
  searchFormRepository: SearchFormRepository,
): Promise<SearchFormWithUser[]> => {
  return await searchFormRepository.getAllSearchForms();
};
