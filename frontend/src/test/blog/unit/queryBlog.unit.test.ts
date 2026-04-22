import axiosInstance from '@shared/utils/axios';
import queryBlog from '@features/blogs/services/queryBlog';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@shared/utils/axios', () => ({
  default: { get: vi.fn() },
}));

describe('queryBlog service unit tests', () => {
  beforeEach(() => {
    // Reset mocks before each test to avoid shared state
    vi.clearAllMocks();
  });

  /**
   * SUCCESS CASE
   * Verifies that the service calls the correct endpoint
   * with properly transformed query parameters.
   */
  it('calls API with correct params', async () => {
    const mockedData = {
      blogs: [],
      total: 0,
    };

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: mockedData,
    });

    const result = await queryBlog(1, 'test', 'Nombre (A-Z)');

    expect(axiosInstance.get).toHaveBeenCalledWith('/blog', {
      params: {
        page: 0,
        searchTerm: 'test',
        sortOption: 'Nombre (A-Z)',
      },
    });

    expect(result).toEqual(mockedData);
  });

  /**
   * ERROR CASE
   * Ensures that errors from Axios are properly propagated
   * instead of being swallowed by the service.
   */
  it('propagates errors', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValueOnce(
      new Error('network error'),
    );

    await expect(queryBlog(1)).rejects.toThrow('network error');
  });
});
