import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { usePlanDistribution } from '@features/graphs/hooks/usePlanDistribution';
import axiosInstance from '@/shared/utils/axios';

vi.mock('@shared/utils/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('usePlanDistribution (Unit Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Verifies hook fetches and returns plan distribution on mount
   */
  test('fetches and returns plan distribution on mount', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: [
        { name: 'Plan Básico', value: 2 },
        { name: 'Plan Estándar', value: 1 },
      ],
    });

    const { result } = renderHook(() => usePlanDistribution());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.distribution).toHaveLength(2);
    expect(result.current.distribution[0].name).toBe('Plan Básico');
  });

  /**
   * Verifies loading state is true while fetching
   */
  test('sets loading to true while fetching', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => usePlanDistribution());
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

    const { result } = renderHook(() => usePlanDistribution());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to fetch plan distribution');
  });
});
