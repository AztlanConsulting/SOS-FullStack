import type { UserRepository } from '@domain/repositories/user.repository';
import type { PermissionMap } from '@validation/auth.types';

export const getUserPermissions = async (
  userRepository: UserRepository,
  userId: string,
): Promise<PermissionMap> => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  if (!user.active) {
    throw new Error('USER_DEACTIVATED');
  }

  const permissions = await userRepository.getUserPermissions(userId);

  const permissionMap: PermissionMap = {};

  for (const perm of permissions) {
    const resource = perm.resourceId.name;

    if (!(resource in permissionMap)) {
      permissionMap[resource] = {
        create: false,
        read: false,
        update: false,
        delete: false,
      };
    }

    const actions = perm.actions;

    if (actions.create) permissionMap[resource].create = true;
    if (actions.read) permissionMap[resource].read = true;
    if (actions.update) permissionMap[resource].update = true;
    if (actions.delete) permissionMap[resource].delete = true;
  }

  return permissionMap;
};
