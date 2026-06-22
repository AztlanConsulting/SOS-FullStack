import type { Blog } from '@domain/models/blog.model';
import { BlogModel } from '@domain/models/blog.model';
import { BlogDataAccess } from '@/infrastructure/data-access/blog.data-access';
import type {
  CreateBlog,
  EditBlog,
} from '@/domain/repositories/blog.repository';
import { Types } from 'mongoose';
import createBlogUC from '@/use-cases/blogs/createBlog.usecase';
import editBlogUC from '@/use-cases/blogs/editBlog.usecase';
import deleteBlogUC from '@/use-cases/blogs/deleteBlog.usecase';

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

  test('create new blog', async () => {
    const mockBlog: CreateBlog = {
      name: 'Perros perdidos',
      duration: 1,
      content: [{ type: 'text', content: 'Hola que hace' }],
      imageUrl: 'https://examlpeImage.com',
      active: true,
    };

    const createdBlog: Blog = {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      name: 'Perros perdidos',
      duration: 1,
      content: [{ type: 'text', content: 'Hola que hace' }],
      imageUrl: 'https://examlpeImage.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    };

    (BlogModel.create as jest.Mock).mockResolvedValue(createdBlog);

    const blog = await createBlogUC(BlogDataAccess, mockBlog);

    expect(blog).toBe(createdBlog);
  });

  test('create new blog', async () => {
    const mockBlog: EditBlog = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Perros perdidos 2',
    };

    const updatedBlog: Blog = {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      name: 'Perros perdidos 2',
      duration: 1,
      content: [{ type: 'text', content: 'Hola que hace' }],
      imageUrl: 'https://examlpeImage.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    };

    (BlogModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedBlog);

    const blog = await editBlogUC(BlogDataAccess, mockBlog);

    expect(blog).toBe(updatedBlog);
  });

  test('create new blog', async () => {
    const mockBlogId = 'id_123456789';

    const deletedBlog: Blog = {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      name: 'Perros perdidos 2',
      duration: 1,
      content: [{ type: 'text', content: 'Hola que hace' }],
      imageUrl: 'https://examlpeImage.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    };

    (BlogModel.findOneAndDelete as jest.Mock).mockResolvedValue(deletedBlog);

    const blog = await deleteBlogUC(BlogDataAccess, mockBlogId);

    expect(blog).toBe(deletedBlog);
  });
});
