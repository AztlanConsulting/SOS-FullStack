import calculatePages from '@shared/utils/calculatePages';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  useMemo,
  useState,
  useCallback,
  type SetStateAction,
  type Dispatch,
} from 'react';

interface Props {
  total: number;
}

// Handle logic for searching
export default function useResourceFilter<T extends Props>(
  queryFunction: (
    page: number,
    searchTerm?: string,
    sortOption?: string,
    typeOption?: string,
  ) => Promise<T>,
  edit: boolean,
  type: string,
  defaultSortOption: string = 'Nombre (A-Z)',
) {
  // Pagination state
  const pageHook = useState(1);
  const [page, setPage] = pageHook;

  // Search Options
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<string>(defaultSortOption);
  const [typeOption, setTypeOption] = useState<string>('Todos');

  const handleSortChange = useCallback(
    (value: React.SetStateAction<string>) => {
      setSortOption(value);
      setPage(1);
    },
    [setPage],
  );

  const handleTypeChange = useCallback(
    (value: React.SetStateAction<string>) => {
      setTypeOption(value);
      setPage(1);
    },
    [setPage],
  );

  // Query
  const query = useQuery({
    queryKey: [type, page, searchTerm, sortOption, typeOption, edit],
    queryFn: async () =>
      queryFunction(page, searchTerm, sortOption, typeOption),
    enabled: !edit,
    placeholderData: keepPreviousData,
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
  const searchHook = {
    handleSearch,
    sortHook: [sortOption, handleSortChange] as [
      string,
      Dispatch<SetStateAction<string>>,
    ],
    typeHook: [typeOption, handleTypeChange] as [
      string,
      Dispatch<SetStateAction<string>>,
    ],
  };
  const pages = { pageHook, visiblePages, totalPages };

  return { searchHook, query, pages };
}
