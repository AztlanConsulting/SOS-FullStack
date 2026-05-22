import axiosInstance from '@shared/utils/axios';
import type { MembersOnly } from '../types/membersOnly.types';

export default async function queryMembersOnlyById(
  id: string,
): Promise<MembersOnly> {
  const { data } = await axiosInstance.get<{
    membersOnly: MembersOnly[];
    total: number;
  }>('/members-only', { params: { id } });

  if (!data.membersOnly || data.membersOnly.length === 0) {
    throw new Error('Members only content not found');
  }

  return data.membersOnly[0];
}
