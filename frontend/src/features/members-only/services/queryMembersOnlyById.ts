import type { MembersOnly } from '../types/membersOnly.types';
import { membersOnlyCards } from '../components/MembersOnlyListSection';

export default async function queryMembersOnlyById(
  id: string,
): Promise<MembersOnly> {
  const card = membersOnlyCards.find((c) => c._id === id);
  if (!card) {
    throw new Error('Members only content not found');
  }
  return card;
}
