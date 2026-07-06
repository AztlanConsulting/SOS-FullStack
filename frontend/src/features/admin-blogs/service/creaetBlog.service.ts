import type { Blog } from '@/features/blog/types/blog.types';
import axiosInstance from '@/shared/utils/axios';

async function createBlog(blog: Blog) {
  const result = await axiosInstance.post('/blog', { ...blog });
  return result;
}

export default createBlog;
