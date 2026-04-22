import axiosInstance from '@shared/utils/axios';
import queryBlogById from '@features/blog/services/queryBlogById';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Axios to isolate service logic from real HTTP requests
vi.mock('@shared/utils/axios', () => ({
  default: { get: vi.fn() },
}));

describe('queryBlogById service unit tests', () => {
  beforeEach(() => {
    // Reset mocks before each test to avoid shared state
    vi.clearAllMocks();
  });

  /**
   * SUCCESS CASE
   * Verifies that the service correctly calls the API
   * and returns the expected blog data by id.
   */
  it('fetches blog by id', async () => {
    const blog = {
      _id: '1',
      name: 'Blog',
      duration: 10,
      content: [],
      imageUrl: '',
      createdAt: '',
      updatedAt: '',
    };

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: { blogs: blog },
    });

    const result = await queryBlogById('1');

    expect(axiosInstance.get).toHaveBeenCalledWith('/blog', {
      params: { id: '1' },
    });

    expect(result).toEqual(blog);
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

    await expect(queryBlogById('1')).rejects.toThrow('network error');
  });
});
