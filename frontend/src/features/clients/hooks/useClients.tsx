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
 * the clients list. Filters are now handled server-side for accurate pagination.
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

  // Reset page to 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  /**
   * Core Fetch Logic:
   * Memoized using useCallback to prevent unnecessary re-renders in child components.
   *
   * Filters are applied server-side for accurate pagination.
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
    setClients([]);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(10),
        search: debouncedSearch,
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.conversation ? { conversation: filters.conversation } : {}),
      });

      const res = await axiosInstance.get(`/clientDashboard?${params}`, {
        signal: controller.signal,
      });
      const result = res.data;

      setClients(res.data.clients);
      setTotalPages(res.data.totalPages);
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
      const params = new URLSearchParams({
        page: '1',
        limit: '9999',
        search: debouncedSearch,
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.conversation ? { conversation: filters.conversation } : {}),
      });
      const res = await axiosInstance.get(
        `/clientDashboard?${params}`,
      );
      return res.data.clients;
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
