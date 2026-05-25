import { useState, useEffect, useCallback } from 'react';
import type { ClientListItem } from '../types/client.type';
import type { ClientFilter } from '../components/FilterDropdown';

/**
 * Delay in milliseconds before the search term is processed.
 * Prevents making an API call for every single keystroke.
 */
const DEBOUNCE_DELAY = 300;

/**
 * useClients Hook
 *
 * Manages the state and business logic for fetching, filtering, and paginating
 * the clients list. It coordinates complex state interactions like debouncing
 * search inputs and resetting pagination when filters change.
 */
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

  /**
   * Reset Pagination:
   * If the search term or filters change, we reset back to page 1
   * because the total result set has changed.
   */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  /**
   * Core Fetch Logic:
   * Memoized using useCallback to prevent unnecessary re-renders in child components.
   */
  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch(
        `/api/clients?${new URLSearchParams({ page: String(page), search: debouncedSearch, ...filters })}`,
      ).then((res) => res.json());
      /**
       * Client-side Filtering:
       * While the API handles search and pagination, additional specific filters
       * (Status and Conversation existence) are processed here.
       */
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
  /**
   * Trigger data fetching whenever dependencies update.
   */
  useEffect(() => {
    fetchClients();
  }, [fetchClients, refetch]);

  /**
   * Utility to manually trigger a data refresh from outside the hook.
   */
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
