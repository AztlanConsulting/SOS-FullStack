import calculatePages from '@shared/utils/calculatePages';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

interface Props {
  total: number;
}

// Handle logic for searching
export default function usePetGallery<T extends Props>(
  queryFunction: (
    img: File,
    page: number,
    searchTerm?: string,
    sortOption?: string,
  ) => Promise<T>,
) {
  // Pagination state
  const pageHook = useState(1);
  const [page, setPage] = pageHook;
  const imgHook = useState<File | null>(null);
  const [img] = imgHook;

  // Search Options
  const [searchTerm, setSearchTerm] = useState('');

  // Query
  const query = useQuery({
    queryKey: [img, page],
    queryFn: () => img && queryFunction(img, page, searchTerm),
    enabled: Boolean(img),
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
  const pages = { pageHook, visiblePages, totalPages };

  return { handleSearch, imgHook, query, pages };
}
