import bcrypt from 'bcryptjs';
import type { User } from '@domain/models/user.model';
import type { UserRepository } from '@domain/repositories/user.repository';
import { createTokenPair } from '@utils/jwt.utils';
import type {
  AuthTokens,
  LoginInput,
  TokenPayload,
} from '@validation/auth.types';

export const loginUser = async (
  userRepository: UserRepository,
  input: LoginInput,
): Promise<{ user: Omit<User, 'password'>; tokens: AuthTokens }> => {
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

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, tokens };
};
