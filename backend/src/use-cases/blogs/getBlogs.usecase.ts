import type { Blog } from '@domain/models/blog.model';
import type {
  BlogRequest,
  BlogRepository,
} from '@/domain/repositories/blog.repository';

/**
 * Fetch blogs and total count.
 *
 * @param blogRepository - Repository instance
 * @param blogRequest - Query parameters (filters, pagination, etc.)
 * @returns Blogs list and total count
 */
export async function getBlogs(
  blogRepository: BlogRepository,
  blogRequest: BlogRequest,
): Promise<{ blogs: Blog[]; totalBlogs: number }> {
  const blogs: Blog[] = await blogRepository.getBlogs(blogRequest);
  const totalBlogs = await blogRepository.getTotalBlogs(blogRequest);

  return { blogs, totalBlogs };
}

/**
 * Fetch a blog by ID.
 *
 * @param blogRepository - Repository instance
 * @param id - Blog ID
 * @returns Blog or null if not found
 */
export async function getBlogById(
  blogRepository: BlogRepository,
  id: string,
): Promise<Blog | null> {
  const blogs: Blog | null = await blogRepository.getBlogById(id);

  return blogs;
}
