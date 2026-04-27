import { RoleModel } from '@domain/models/role.model';
import type { RoleRepository } from '@domain/repositories/role.repository';

export const roleDataAccess: RoleRepository = {
  /**
   * Finds a role ID by its name.
   *
   * @param role - Role name (e.g., 'ADMIN', 'CLIENT')
   * @returns Role ID if found, otherwise null
   */
  getRoleIdByName: async function (role: string): Promise<string | null> {
    const normalizedRole = role.toUpperCase();

    const foundRole = await RoleModel.findOne({ role: normalizedRole })
      .select('_id')
      .lean<{ _id: string }>()
      .exec();

    return foundRole?._id ?? null;
  },
};
