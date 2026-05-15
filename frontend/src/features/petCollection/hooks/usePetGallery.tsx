import calculatePages from '@shared/utils/calculatePages';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { PetFilter, PetInfo } from '../types/petCollection.types';

// Handle logic for searching
export default function usePetGallery(
  queryFunction: (
    img: File,
    page: number,
    filters: PetFilter,
  ) => Promise<PetInfo[]>,
  pageQueryFunction: (img: File, filter: PetFilter) => Promise<number>,
) {
  // Pagination state
  const pageHook = useState(1);
  const [page, setPage] = pageHook;
  const [img, setImage] = useState<File | null>(null);
  const imgHook: [File | null, (f: File) => void] = [
    img,
    (img: File) => {
      setImage(img);
      setPage(1);
    },
  ];

  // Search Options
  const [filters, setFilters] = useState<PetFilter>({
    color: '',
    location: '',
    species: '',
  });

  // Query
  const vectorImages = useQuery({
    queryKey: [
      img?.name,
      page,
      filters.color,
      filters.location,
      filters.species,
    ],
    queryFn: () => img && queryFunction(img, page, filters),
    enabled: Boolean(img),
  });
  const total = useQuery({
    queryKey: [img?.name, filters.color, filters.location, filters.species],
    queryFn: () => img && pageQueryFunction(img, filters),
    enabled: Boolean(img),
  });

  // Pagination
  const [visiblePages, totalPages] = useMemo(() => {
    return total.data ? calculatePages(total.data, page, 8) : [[], 0];
  }, [total, page]);

  function handleSearch(key: string, value: string) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  }

  // Structure data
  const pages = { pageHook, visiblePages, totalPages };

  return { handleSearch, imgHook, vectorImages, pages };
}
