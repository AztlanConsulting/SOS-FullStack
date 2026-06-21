import type { Blog } from '@/features/blog/types/blog.types';
import axiosInstance from '@/shared/utils/axios';

async function editBlog(blog: Pick<Partial<Blog>, '_id'>) {
  const result = await axiosInstance.put('/blog', { ...blog });
  return result;
}

export default editBlog;
