import { BlogModel } from '@domain/models/blog.model';
import { BlogDataAccess } from '@/infrastructure/data-access/blog.data-access';

jest.mock('@domain/models/blog.model');

describe('blog data access unit tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test to avoid state leakage
    jest.clearAllMocks();
  });

  /**
   * GET BLOGS - SUCCESS CASE
   * Verifies that the repository correctly returns a list of blogs
   * when the database query resolves successfully.
   */
  test('getBlogs returns list of blogs', async () => {
    const mockBlogs = [
      {
        name: 'Blog 1',
        duration: 5,
        content: [],
        imageUrl: 'url',
      },
      {
        name: 'Blog 2',
        duration: 10,
        content: [],
        imageUrl: 'url',
      },
    ];

    // Mock Mongoose chain: find -> skip -> limit -> sort -> exec
    (BlogModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockBlogs),
    });

    const result = await BlogDataAccess.getBlogs({
      page: 0,
      searchTerm: '',
      sortOption: 'Nombre (A-Z)',
    });

    expect(BlogModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockBlogs);
  });

  /**
   * GET BLOGS - EMPTY RESULT
   * Ensures repository returns an empty array when no documents exist.
   */
  test('getBlogs returns empty array', async () => {
    (BlogModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    });

    const result = await BlogDataAccess.getBlogs({
      page: 0,
      searchTerm: '',
      sortOption: 'Nombre (A-Z)',
    });

    expect(result).toEqual([]);
  });

  /**
   * GET BLOGS - ERROR HANDLING
   * Verifies that errors from the database layer are properly propagated.
   */
  test('getBlogs throws error', async () => {
    const mockError = new Error('Database error');

    (BlogModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(mockError),
    });

    await expect(
      BlogDataAccess.getBlogs({
        page: 0,
        searchTerm: '',
        sortOption: 'Nombre (A-Z)',
      }),
    ).rejects.toThrow('Database error');
  });

  /**
   * COUNT BLOGS
   * Ensures total count query returns correct value.
   */
  test('getTotalBlogs returns total count', async () => {
    const mockTotal = 10;

    (BlogModel.countDocuments as jest.Mock).mockResolvedValue(mockTotal);

    const result = await BlogDataAccess.getTotalBlogs({
      searchTerm: '',
    });

    expect(result).toBe(mockTotal);
  });
});
