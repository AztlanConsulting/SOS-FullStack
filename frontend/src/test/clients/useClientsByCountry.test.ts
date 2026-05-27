import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useClientsByCountry } from '@features/graphs/hooks/useClientsByCountry';
import axiosInstance from '@/shared/utils/axios';

vi.mock('@shared/utils/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('useClientsByCountry (Unit Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Verifies hook fetches and returns country data on mount
   */
  test('fetches and returns country data on mount', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: [
        { name: 'México', value: 3 },
        { name: 'Colombia', value: 1 },
      ],
    });

    const { result } = renderHook(() => useClientsByCountry());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('México');
    expect(result.current.data[0].value).toBe(3);
  });

  /**
   * Verifies loading state is true while fetching
   */
  test('sets loading to true while fetching', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useClientsByCountry());
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

    const { result } = renderHook(() => useClientsByCountry());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Error al cargar distribución por país');
  });

  /**
   * Verifies empty data returns empty array
   */
  test('returns empty array when no country data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue([]),
      }),
    );

    const { result } = renderHook(() => useClientsByCountry());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toHaveLength(0);
  });
});
