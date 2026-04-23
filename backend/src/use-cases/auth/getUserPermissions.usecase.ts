import type { UserRepository } from '@domain/repositories/user.repository';
import type { PermissionMap } from '@validation/auth.types';

/**
 * Resolves the effective permissions of a user into a normalized map.
 * Combines all permissions (role + user overrides) and aggregates them by resource.
 *
 * @param userRepository - Repository abstraction for user data access
 * @param userId - User ID
 * @return A permission map grouped by resource name
 */
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

    // Initialize resource entry if it doesn't exist
    if (!(resource in permissionMap)) {
      permissionMap[resource] = {
        create: false,
        read: false,
        update: false,
        delete: false,
      };
    }

    const actions = perm.actions;

    // if any permission grants access, it becomes true
    if (actions.create) permissionMap[resource].create = true;
    if (actions.read) permissionMap[resource].read = true;
    if (actions.update) permissionMap[resource].update = true;
    if (actions.delete) permissionMap[resource].delete = true;
  }

  return permissionMap;
};
