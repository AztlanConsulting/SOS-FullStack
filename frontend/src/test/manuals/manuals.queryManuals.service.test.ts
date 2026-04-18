import { beforeEach, describe, expect, it, vi } from 'vitest';
import queryManual from '@features/manuals/services/queryManuals';
import axiosInstance from '@shared/utils/axios';

// Isolate service behavior by mocking the shared axios instance.
vi.mock('@shared/utils/axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('queryManual service', () => {
  beforeEach(() => {
    // Ensure call history does not leak between tests.
    vi.clearAllMocks();
  });

  it('calls endpoint with transformed params and returns response data', async () => {
    const mockedData = {
      manuals: [
        { _id: 'm1', name: 'Manual A', price: 100, content: '', imageUrl: '' },
      ],
      total: 1,
    };

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockedData });

    // Page 2 in UI should be page 1 for backend (zero-based pagination).
    const result = await queryManual(2, 'perro', 'Nombre (A-Z)');

    expect(axiosInstance.get).toHaveBeenCalledWith('/manuals/getManuals', {
      params: {
        page: 1,
        searchTerm: 'perro',
        sortOption: 'Nombre (A-Z)',
      },
    });
    expect(result).toEqual(mockedData);
  });

  it('propagates request errors', async () => {
    // The service should not swallow request failures.
    const error = new Error('network failed');
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(error);

    await expect(queryManual(1)).rejects.toThrow('network failed');
  });
});
