import type { Types } from 'mongoose';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { UserDTO } from '@validation/auth.types';

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

  const safeUser: UserDTO = {
    _id: user._id,
    username: user.username,
    email: user.email,
    roleId: user.roleId as Types.ObjectId,
    active: user.active,
  };

  return safeUser;
};
