import { beforeEach, describe, expect, it, vi } from 'vitest';
import queryResources, {
  deleteResource,
} from '@features/resources/services/queryResources';
import axiosInstance from '@shared/utils/axios';

vi.mock('@shared/utils/axios', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('queryResources service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls endpoint with transformed params and returns response data', async () => {
    const mockedData = {
      resources: [
        {
          _id: 'r1',
          name: 'Recurso 1',
          type: 'Manual',
          price: 50,
          content: [],
          imageUrl: '',
          resourceUrl: '',
        },
      ],
      total: 1,
    };

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: mockedData });

    const result = await queryResources(2, 'perro', 'Nombre (Z-A)', 'Manual');

    expect(axiosInstance.get).toHaveBeenCalledWith('/resources', {
      params: {
        page: 1,
        searchTerm: 'perro',
        sortOption: 'Nombre (Z-A)',
        typeOption: 'Manual',
      },
    });
    expect(result).toEqual(mockedData);
  });

  it('propagates request errors', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error('network'));

    await expect(queryResources(1)).rejects.toThrow('network');
  });
});

describe('deleteResource service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls DELETE endpoint with the resource id', async () => {
    vi.mocked(axiosInstance.delete).mockResolvedValueOnce({ data: undefined });

    await deleteResource('resource-123');

    expect(axiosInstance.delete).toHaveBeenCalledWith(
      '/resources/resource-123',
    );
  });

  it('propagates delete request errors', async () => {
    vi.mocked(axiosInstance.delete).mockRejectedValueOnce(
      new Error('not found'),
    );

    await expect(deleteResource('bad-id')).rejects.toThrow('not found');
  });
});
