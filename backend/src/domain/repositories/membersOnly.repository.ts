import type { MembersOnly } from '@domain/models/membersOnly.model';

export interface MembersOnlyRequest {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
}

export interface MembersOnlyRepository {
  getMembersOnly(query: MembersOnlyRequest): Promise<MembersOnly[]>;
  getMembersOnlyById(id: string): Promise<MembersOnly | null>;
  getTotalMembersOnly(query: MembersOnlyRequest): Promise<number>;
  createMembersOnly(
    data: Omit<MembersOnly, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MembersOnly>;
}
