import bcrypt from 'bcryptjs';
import type { UserRepository } from '@domain/repositories/user.repository';
import { createTokenPair } from '@utils/jwt.utils';
import type {
  AuthTokens,
  LoginInput,
  TokenPayload,
  UserDTO,
} from '@validation/auth.types';

export const loginUser = async (
  userRepository: UserRepository,
  input: LoginInput,
): Promise<{ user: UserDTO; tokens: AuthTokens }> => {
  const user = await userRepository.getUserByEmail(input.email);

  if (!user) {
    throw new Error('INVALID CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new Error('INVALID CREDENTIALS');
  }

  const payload: TokenPayload = {
    userId: user._id,
    email: user.email,
    roleId: user.roleId,
  };

  const tokens = createTokenPair(payload);
  // TODO: Add storeRefreshToken() function

  const safeUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    active: user.active,
  };

  return { user: safeUser, tokens };
};
