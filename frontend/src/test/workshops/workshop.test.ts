import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import queryWorkshop from '@features/workshop/services/queryWorkshops';
import queryWorkshopById from '@features/workshop/services/queryWorkshopById';
import axiosInstance from '@shared/utils/axios';

// Isolate service behavior by mocking the shared axios instance.
vi.mock('@shared/utils/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('queryWorkshop service', () => {
  beforeEach(() => {
    // Use a deterministic base URL for endpoint assertions.
    vi.clearAllMocks();
    vi.stubEnv('VITE_API_BASE_URL', 'http://api.test');
  });

  afterEach(() => {
    // Restore global fetch and environment to avoid cross-test contamination.
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('calls endpoint with transformed params and returns response data', async () => {
    const mockedData = {
      workshops: [
        { _id: 'm1', name: 'Workshops', price: 100, content: '', imageUrl: '' },
      ],
      total: 1,
    };

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockedData });

    const result = await queryWorkshop(1, 'workshop', 'Nombre (A-Z)');

    expect(axiosInstance.get).toHaveBeenCalledWith('/workshop', {
      params: {
        page: 0,
        searchTerm: 'workshop',
        sortOption: 'Nombre (A-Z)',
      },
    });
    expect(result).toEqual(mockedData);
  });

  it('calls queryWorkshopsById', async () => {
    const id = '23456789';
    const workshop = {
      _id: id,
      name: 'Workshops',
      price: 100,
      content: '',
      imageUrl: '',
    };
    const mockedData = {
      workshops: workshop,
      total: 1,
    };

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockedData });

    const result = await queryWorkshopById(id);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/workshop`, {
      params: {
        id,
      },
    });
    expect(result).toEqual(workshop);
  });

  it('propagates request errors', async () => {
    // The service should not swallow request failures.
    const error = new Error('network failed');
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(error);

    await expect(queryWorkshop(1)).rejects.toThrow('network failed');
  });
});
