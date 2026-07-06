import { useQuery } from '@tanstack/react-query';
import { getSearchForms } from '../services/searchForm.service';
import type { SearchFormWithUser } from '../services/searchForm.service';

export const useSearchForms = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['searchForms'],
    queryFn: getSearchForms,
  });

  return {
    forms: (data?.data ?? []).filter(
      (f) => f.createdBy != null,
    ) as SearchFormWithUser[],
    loading: isLoading,
    error: error ? 'Error al cargar los formularios de búsqueda' : null,
  };
};
