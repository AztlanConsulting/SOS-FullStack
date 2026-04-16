import axiosInstance from '@shared/utils/axios';
import type { ManualResult } from '../types/Manual.type';

export default async function queryManual(
  page: number,
  searchTerm?: string,
  sortOption?: string,
): Promise<ManualResult> {
  const response = await axiosInstance.get(`/manuals/getManuals`, {
    params: {
      page: page - 1,
      searchTerm: searchTerm,
      sortOption: sortOption,
    },
  });

  return response.data;
}
