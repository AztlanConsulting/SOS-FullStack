import type { Blog } from '@domain/models/blog.model';
import type {
  BlogRequest,
  BlogRepository,
} from '@domain/repositories/blog.repository';
import { normalizeContent } from '@utils/content.mapper';

/**
 * Fetch blogs and total count.
 *
 * @param blogRepository - Repository instance
 * @param blogRequest - Query parameters (filters, pagination, etc.)
 * @returns Blogs list and total count
 */
export async function getBlogsList(
  blogRepository: BlogRepository,
  blogRequest: BlogRequest,
): Promise<{ blogs: Blog[]; totalBlogs: number }> {
  const blogs = await blogRepository.getBlogs(blogRequest);
  const totalBlogs = await blogRepository.getTotalBlogs(blogRequest);

  return {
    blogs: blogs.map(normalizeBlog),
    totalBlogs,
  };
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
  const blog: Blog | null = await blogRepository.getBlogById(id);

  if (!blog) return null;

  return normalizeBlog(blog);
}

/**
 * Normalizes a Blog entity.
 *
 * @param blog - Blog document or plain object
 * @returns Normalized Blog
 */
function normalizeBlog(blog: Blog): Blog {
  const plainBlog =
    typeof (blog as Blog & { toObject?: () => Blog }).toObject === 'function'
      ? (blog as Blog & { toObject: () => Blog }).toObject()
      : blog;

  return {
    ...plainBlog,
    duration: typeof plainBlog.duration === 'number' ? plainBlog.duration : 0,
    content: normalizeContent(plainBlog.content),
  };
}
