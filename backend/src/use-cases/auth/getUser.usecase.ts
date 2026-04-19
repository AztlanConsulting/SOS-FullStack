import type { Types } from 'mongoose';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { UserDTO } from '@validation/auth.types';

/**
 * Retrieves a user by ID and maps it to a safe DTO.
 * Applies basic validation such as existence and active status.
 *
 * @param userRepository - Repository abstraction for user data access
 * @param userId - User ID
 * @return A sanitized user DTO
 */
export const getUserById = async (
  userRepository: UserRepository,
  userId: string,
): Promise<UserDTO> => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  if (!user.active) {
    throw new Error('USER_DEACTIVATED');
  }

  // Return only safe/exposed fields
  const safeUser: UserDTO = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.roleId.role,
    active: user.active,
  };

  return safeUser;
};
