import calculatePages from '@shared/utils/calculatePages';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

interface Props {
  total: number;
}

// Handle logic for searching
export default function useProduct<T extends Props>(
  queryFunction: (
    page: number,
    searchTerm?: string,
    sortOption?: string,
  ) => Promise<T>,
  type: string,
) {
  // Pagination state
  const pageHook = useState(1);
  const [page, setPage] = pageHook;

  // Search Options
  const [searchTerm, setSearchTerm] = useState('');
  const sortHook = useState<string>('Nombre (A-Z)');
  const sortOption = sortHook[0];

  // Query
  const query = useQuery({
    queryKey: [type, page, searchTerm, sortOption],
    queryFn: async () => queryFunction(page, searchTerm, sortOption),
  });
  const { data } = query;

  // Pagination
  const [visiblePages, totalPages] = useMemo(() => {
    return data ? calculatePages(data.total, page, 6) : [[], 0];
  }, [data, page]);

  function handleSearch(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  // Structure data
  const searchHook = { handleSearch, sortHook };
  const pages = { pageHook, visiblePages, totalPages };

  return { searchHook, query, pages };
}
