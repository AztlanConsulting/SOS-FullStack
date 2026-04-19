import axiosInstance from '@shared/utils/axios';
import type { WorkshopResult } from '../types/workshop';

export default async function queryWorkshop(
  page: number,
  searchTerm?: string,
  sortOption?: string,
): Promise<WorkshopResult> {
  const response = await axiosInstance.get(`/workshop`, {
    params: {
      page: page - 1,
      searchTerm: searchTerm,
      sortOption: sortOption,
    },
  });

  return response.data;
}
