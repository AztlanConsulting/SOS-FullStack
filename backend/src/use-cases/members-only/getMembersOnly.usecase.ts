import type { MembersOnly } from '@domain/models/membersOnly.model';
import type {
  MembersOnlyRequest,
  MembersOnlyRepository,
} from '@domain/repositories/membersOnly.repository';

export async function createMembersOnly(
  membersOnlyRepository: MembersOnlyRepository,
  data: Omit<MembersOnly, '_id' | 'createdAt' | 'updatedAt'>,
): Promise<MembersOnly> {
  return await membersOnlyRepository.createMembersOnly(data);
}

export async function getMembersOnlyList(
  membersOnlyRepository: MembersOnlyRepository,
  request: MembersOnlyRequest,
): Promise<{ membersOnly: MembersOnly[]; total: number }> {
  const membersOnly = await membersOnlyRepository.getMembersOnly(request);
  const total = await membersOnlyRepository.getTotalMembersOnly(request);
  return { membersOnly, total };
}

export async function getMembersOnlyById(
  membersOnlyRepository: MembersOnlyRepository,
  id: string,
): Promise<MembersOnly | null> {
  return await membersOnlyRepository.getMembersOnlyById(id);
}
