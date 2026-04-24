import type { SortOrder } from 'mongoose';
import type { Blog } from '@/domain/models/blog.model';
import { BlogModel } from '@/domain/models/blog.model';
import type {
  BlogRequest,
  BlogRepository,
} from '@/domain/repositories/blog.repository';

const limit = 6;
export const BlogDataAccess: BlogRepository = {
  /**
   * Get a list of blogs
   * @param page - page of query / skip
   * @param sortOption - sorting options / string
   * @param searchTerm - optional string - search term
   * @returns a list of blogs
   */
  getBlogs: async function ({
    page = 0,
    sortOption = 'Nombre (A-Z)',
    searchTerm = '',
  }: BlogRequest): Promise<Blog[]> {
    const sort: Record<string, { [key: string]: SortOrder }> = {
      'Nombre (A-Z)': { name: 1 },
      'Nombre (Z-A)': { name: -1 },
    };

    const blogs = await BlogModel.find({
      name: { $regex: searchTerm, $options: 'i' },
    })
      .skip(page * limit)
      .limit(limit)
      .sort(sort[sortOption])
      .exec();

    return blogs;
  },

  /**
   * Get a specific blog by its id
   * @param id - id of a specific blog
   * @returns Blog
   */
  getBlogById: async function (id: string): Promise<Blog | null> {
    const blog = await BlogModel.findById(id).exec();
    return blog;
  },

  /**
   * Get the total amount of blogs for pagination
   * @param searchTerm - filter to better calculate the amount of pages
   * @returns number of records
   */
  getTotalBlogs: async function ({ searchTerm = '' }): Promise<number> {
    const totalBlogs = await BlogModel.countDocuments({
      name: { $regex: searchTerm, $options: 'i' },
    });
    return totalBlogs;
  },
};
