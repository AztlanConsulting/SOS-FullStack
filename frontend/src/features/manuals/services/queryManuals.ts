import axiosInstance from '@shared/utils/axios';
import type { ManualResult } from '../types/Manual.type';

/**
 * Queries manuals from the API with pagination, search, and sorting support.
 * Converts 1-based page numbers (UI) to 0-based pagination (API).
 * @param page - 1-based page number for pagination
 * @param searchTerm - Optional partial text to filter manuals by name (case-insensitive)
 * @param sortOption - Optional sorting criterion (e.g., 'Nombre (A-Z)', 'Precio: menor a mayor')
 * @returns Promise resolving to ManualResult containing paginated list and total count
 * @throws Error if the axios request fails
 */
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
