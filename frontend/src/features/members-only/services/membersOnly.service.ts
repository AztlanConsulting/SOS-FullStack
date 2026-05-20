import axiosInstance from '@shared/utils/axios';
import type { MembersOnlyResult } from '../types/membersOnly.types';

export const getMembersOnlyList = async (
  page = 1,
): Promise<MembersOnlyResult> => {
  const { data } = await axiosInstance.get<MembersOnlyResult>('/members-only', {
    params: { page: page - 1 },
  });
  return data;
};
