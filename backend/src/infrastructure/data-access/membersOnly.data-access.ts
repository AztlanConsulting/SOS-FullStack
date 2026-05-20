import type { SortOrder } from 'mongoose';
import type { MembersOnly } from '@domain/models/membersOnly.model';
import { MembersOnlyModel } from '@domain/models/membersOnly.model';
import type {
  MembersOnlyRequest,
  MembersOnlyRepository,
} from '@domain/repositories/membersOnly.repository';

const limit = 6;

export const MembersOnlyDataAccess: MembersOnlyRepository = {
  getMembersOnly: async function ({
    page = 0,
    sortOption = 'Nombre (A-Z)',
    searchTerm = '',
  }: MembersOnlyRequest): Promise<MembersOnly[]> {
    const sort: Record<string, { [key: string]: SortOrder }> = {
      'Nombre (A-Z)': { name: 1 },
      'Nombre (Z-A)': { name: -1 },
    };

    const items = await MembersOnlyModel.find({
      name: { $regex: searchTerm, $options: 'i' },
    })
      .skip(page * limit)
      .limit(limit)
      .sort(sort[sortOption])
      .exec();

    return items;
  },

  getMembersOnlyById: async function (id: string): Promise<MembersOnly | null> {
    const item = await MembersOnlyModel.findById(id).exec();
    return item;
  },

  getTotalMembersOnly: async function ({
    searchTerm = '',
  }: MembersOnlyRequest): Promise<number> {
    const total = await MembersOnlyModel.countDocuments({
      name: { $regex: searchTerm, $options: 'i' },
    });
    return total;
  },

  createMembersOnly: async function (
    data: Omit<MembersOnly, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MembersOnly> {
    const created = await MembersOnlyModel.create(data);
    return created.toObject() as MembersOnly;
  },
};
