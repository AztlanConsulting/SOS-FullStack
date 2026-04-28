import axiosInstance from '@shared/utils/axios';
import type { Blog } from '../types/blog.types';

export default async function queryBlogById(id: string): Promise<Blog> {
  const { data } = await axiosInstance.get(`/blog`, {
    params: { id },
  });
  return data.blogs as Blog;
}
