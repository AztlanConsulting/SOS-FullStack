import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDashboardMetrics } from '@/features/graphs/hooks/useDashboardMetrics';
import { getDashboardMetrics } from '@/features/graphs/services/graphs.service';
import type { DashboardResponse } from '@/features/graphs/types/dashboardMetrics';

vi.mock('@/features/graphs/services/graphs.service', () => ({
  getDashboardMetrics: vi.fn(),
}));

const dashboardResponse: DashboardResponse = {
  planProgress: {
    planName: 'Básico',
    totalDays: 30,
    daysRemaining: 12,
    petName: 'Firulais',
    petImage: '/pet.jpg',
    posterImage: '/poster.jpg',
    dateMissing: '2026-05-01',
    location: 'Parque Alameda',
  },
  resources: [],
};

describe('useDashboardMetrics', () => {
  beforeEach(() => {
    vi.mocked(getDashboardMetrics).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads dashboard metrics successfully', async () => {
    vi.mocked(getDashboardMetrics).mockResolvedValue(dashboardResponse);

    const { result } = renderHook(() => useDashboardMetrics());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics).toEqual(dashboardResponse);
    expect(result.current.error).toBeNull();
  });

  it('exposes an error message when the service fails', async () => {
    const error = new Error('Network error');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    vi.mocked(getDashboardMetrics).mockRejectedValue(error);

    const { result } = renderHook(() => useDashboardMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics).toBeNull();
    expect(result.current.error).toBe(
      'Error al cargar la información del dashboard',
    );
    expect(consoleError).toHaveBeenCalledWith(error);
  });
});
