import calculatePages from '@shared/utils/calculatePages';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { PetInfo } from '../types/petCollection.types';

// Handle logic for searching
export default function usePetGallery(
  queryFunction: (
    img: File,
    page: number,
    searchTerm?: string,
    sortOption?: string,
  ) => Promise<PetInfo[]>,
  pageQueryFunction: (img: File) => Promise<number>,
) {
  // Pagination state
  const pageHook = useState(1);
  const [page, setPage] = pageHook;
  const imgHook = useState<File | null>(null);
  const [img] = imgHook;

  // Search Options
  const [searchTerm, setSearchTerm] = useState('');

  // Query
  const vectorImages = useQuery({
    queryKey: [img, page],
    queryFn: () => img && queryFunction(img, page, searchTerm),
    enabled: Boolean(img),
  });
  const total = useQuery({
    queryKey: [img],
    queryFn: () => img && pageQueryFunction(img),
    enabled: Boolean(img),
  });

  // Pagination
  const [visiblePages, totalPages] = useMemo(() => {
    return total.data ? calculatePages(total.data, page, 10) : [[], 0];
  }, [total, page]);

  function handleSearch(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  // Structure data
  const pages = { pageHook, visiblePages, totalPages };

  return { handleSearch, imgHook, vectorImages, pages };
}
