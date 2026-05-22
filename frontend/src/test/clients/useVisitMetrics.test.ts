import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { useVisitMetrics } from '@features/graphs/hooks/useVisitMetrics';

describe('useVisitMetrics (Unit Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Verifies hook fetches visit metrics with year and month params
   */
  test('fetches visit metrics with correct params', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue([
          { week: 'Semana 1', views: 45, engagement: 67 },
          { week: 'Semana 2', views: 0, engagement: 0 },
          { week: 'Semana 3', views: 0, engagement: 0 },
          { week: 'Semana 4', views: 0, engagement: 0 },
        ]),
      }),
    );

    const { result } = renderHook(() => useVisitMetrics(2026, 5));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.visits).toHaveLength(4);
    expect(result.current.visits[0].week).toBe('Semana 1');
    expect(result.current.visits[0].views).toBe(45);
    expect(fetch).toHaveBeenCalledWith('/metrics/visits?year=2026&month=5');
  });

  /**
   * Verifies loading state is true while fetching
   */
  test('sets loading to true while fetching', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue([]),
      }),
    );

    const { result } = renderHook(() => useVisitMetrics(2026, 5));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  /**
   * Verifies error state is set when fetch fails
   */
  test('sets error when fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error')),
    );

    const { result } = renderHook(() => useVisitMetrics(2026, 5));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to fetch visit metrics');
  });

  /**
   * Verifies refetch when year or month changes
   */
  test('refetches when year or month changes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue([]),
      }),
    );

    const { rerender } = renderHook(
      ({ year, month }) => useVisitMetrics(year, month),
      { initialProps: { year: 2026, month: 5 } },
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    rerender({ year: 2026, month: 4 });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(fetch).toHaveBeenCalledWith('/metrics/visits?year=2026&month=4');
  });
});
