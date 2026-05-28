import { useState, useEffect, useCallback, useRef } from 'react';
import type { ClientListItem } from '../types/client.type';
import type { ClientFilter } from '../components/FilterDropdown';
import axiosInstance from '@/shared/utils/axios';

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
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [search]);

  /**
   * Core Fetch Logic:
   * Memoized using useCallback to prevent unnecessary re-renders in child components.
   *
   * When client-side filters are active (status or conversation), fetches all results
   * without pagination to ensure accurate filtering. Otherwise uses normal pagination.
   *
   * Uses AbortController to cancel previous requests if a new one is initiated.
   */
  const fetchClients = useCallback(async () => {
    // Abort previous request if it exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const hasClientFilter = filters.status || filters.conversation;
      const params = new URLSearchParams({
        page: hasClientFilter ? '1' : String(page), // ← always use 1 when filtering
        ...(hasClientFilter ? { limit: '9999' } : {}),
        search: debouncedSearch,
      });

      const res = await axiosInstance.get(`/clientDashboard?${params}`, {
        signal: controller.signal,
      });
      const result = res.data;

      console.log(
        'before filter:',
        result.clients.map((c: any) => ({
          name: c.username,
          status: c.plan?.status,
        })),
      );
      console.log('filter value:', filters.status);

      /**
       * Client-side Filtering:
       * Status and Conversation filters are applied here.
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
      setTotalPages(hasClientFilter ? 1 : result.totalPages);
    } catch (err: any) {
      // Ignore abort errors
      if (err.name !== 'CanceledError') {
        setError('Failed to fetch clients');
      }
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
   * Cleanup: abort pending request on unmount
   */
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Utility to manually trigger a data refresh from outside the hook.
   */
  const refresh = () => setRefetch((r) => r + 1);

  /**
   * Fetches all clients without pagination limit and applies active filters.
   * Used for CSV export to include all matching records, not just the current page.
   */
  const exportClients = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `/clientDashboard?${new URLSearchParams({ page: '1', limit: '9999', search: debouncedSearch })}`,
      );
      return res.data.clients
        .filter(
          (c: ClientListItem) =>
            !filters.status || c.plan?.status === filters.status,
        )
        .filter((c: ClientListItem) => {
          if (!filters.conversation) return true;
          if (filters.conversation === 'con') return Boolean(c.conversation);
          return !c.conversation;
        });
    } catch (err) {
      console.error('Failed to export clients:', err);
      return [];
    }
  }, [debouncedSearch, filters]);

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
    exportClients,
  };
};
