import axiosInstance from '@shared/utils/axios';
import type { BlogResult } from '../types/blog.types';

export default async function queryBlog(
  page: number,
  searchTerm?: string,
  sortOption?: string,
): Promise<BlogResult> {
  const response = await axiosInstance.get(`/blog`, {
    params: {
      page: page - 1,
      searchTerm: searchTerm,
      sortOption: sortOption,
    },
  });

  return response.data;
}
