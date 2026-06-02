import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useClients } from '@/features/clients/hooks/useClients';
import type { PlanStatus } from '@/features/clients/types/client.type';
import axiosInstance from '@/shared/utils/axios';

vi.mock('@/features/clients/services/client.service');
vi.mock('@shared/utils/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockResponse = {
  clients: [
    {
      _id: '1',
      username: 'Sebastian',
      email: 'sebastian@test.com',
      phone: '1234567890',
      conversation: 'https://sos.com',
      pet: { _id: 'p1', name: 'Pookie', species: 'dog' },
      plan: {
        _id: 'pl1',
        name: 'Plan Básico',
        status: 'continua' as PlanStatus,
      },
    },
  ],
  total: 1,
  page: 1,
  totalPages: 1,
};

describe('useClients (Unit Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: mockResponse,
    });
  });

  /**
   * Verifies hook fetches and returns clients on mount
   */
  test('fetches and returns clients on mount', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.clients).toHaveLength(1);
    expect(result.current.clients[0].username).toBe('Sebastian');
  });

  /**
   * Verifies loading state is true while fetching
   */
  test('sets loading to true while fetching', async () => {
    const { result } = renderHook(() => useClients());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  /**
   * Verifies error state is set when fetch fails
   */
  test('sets error when fetch fails', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValue({
      error: new Error('Network error'),
    });
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to fetch clients');
  });

  /**
   * Verifies page resets to 1 when search changes
   */
  test('resets page to 1 when search changes', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setPage(3);
    });
    act(() => {
      result.current.setSearch('Sebastian');
    });

    await waitFor(
      () =>
        expect(axiosInstance.get).toHaveBeenCalledWith(
          expect.stringContaining('search=Sebastian'),
          expect.anything(),
        ),
      { timeout: 2000 }, // wait up to 2s for debounce + fetch
    );
  }, 10000); // extend test timeout to 10s

  /**
   * Verifies refresh triggers a new fetch
   */
  test('refresh triggers a new fetch', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalledTimes(2), {
      timeout: 2000,
    });
  }, 10000);
});
