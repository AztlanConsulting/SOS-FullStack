import { beforeEach, describe, expect, it, vi } from 'vitest';
import axiosInstance from '@shared/utils/axios';
import { getDashboardMetrics } from '@/features/graphs/services/graphs.service';
import type { DashboardResponse } from '@/features/graphs/types/dashboardMetrics';

vi.mock('@shared/utils/axios', () => ({
  default: {
    get: vi.fn(),
  },
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
};

describe('getDashboardMetrics', () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.get).mockReset();
  });

  it('requests the client home endpoint and returns its data', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: dashboardResponse });

    const result = await getDashboardMetrics();

    expect(axiosInstance.get).toHaveBeenCalledWith('/clients/inicio');
    expect(result).toEqual(dashboardResponse);
  });
});
