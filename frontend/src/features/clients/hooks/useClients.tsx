import { useState, useEffect, useCallback } from 'react';
import type { ClientListItem } from '../types/client.type';
import type { ClientFilter } from '../components/FilterDropdown';

const DEBOUNCE_DELAY = 300;

export const useClients = () => {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [refetch, setRefetch] = useState(0);
  const [filters, setFilters] = useState<ClientFilter>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch(
        `/api/clients?${new URLSearchParams({ page: String(page), search: debouncedSearch, ...filters })}`,
      ).then((res) => res.json());
      const filtered = result.clients
        .filter(
          (c: ClientListItem) =>
            !filters.status || c.plan?.status === filters.status,
        )
        .filter((c: ClientListItem) => {
          if (!filters.conversation) return true;
          if (filters.conversation === 'con') return Boolean(c.conversation);
          return !c.conversation;
        });

      setClients(filtered);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters]);
  useEffect(() => {
    fetchClients();
  }, [fetchClients, refetch]);

  const refresh = () => setRefetch((r) => r + 1);

  return {
    clients,
    loading,
    error,
    page,
    totalPages,
    search,
    setPage,
    setSearch,
    fetchClients,
    refresh,
    filters,
    setFilters,
  };
};
