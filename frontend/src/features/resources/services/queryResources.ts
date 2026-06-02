import axiosInstance from '@shared/utils/axios';
import type { ResourceResult } from '../types/resource';

export default async function queryResources(
  page: number,
  searchTerm?: string,
  sortOption?: string,
  typeOption?: string,
): Promise<ResourceResult> {
  const response = await axiosInstance.get(`/resources`, {
    params: {
      page: page - 1,
      searchTerm: searchTerm,
      sortOption: sortOption,
      typeOption: typeOption,
    },
  });

  return response.data;
}
