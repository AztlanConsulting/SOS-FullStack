import axiosInstance from '@shared/utils/axios';
import type { MembersOnlyResult } from '../types/membersOnly.types';

export const getMembersOnlyList = async (
  page = 0,
  searchTerm = '',
  sortOption = 'Nombre (A-Z)',
): Promise<MembersOnlyResult> => {
  const { data } = await axiosInstance.get<MembersOnlyResult>('/members-only', {
    params: { page, searchTerm, sortOption },
  });
  return data;
};
