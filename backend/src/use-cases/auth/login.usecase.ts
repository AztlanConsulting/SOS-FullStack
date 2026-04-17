import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { config } from '@config/env.config';
import type { UserRepository } from '@domain/repositories/user.repository';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';
import { createTokenPair, parseExpiration } from '@utils/jwt.utils';
import type {
  AuthTokens,
  LoginInput,
  TokenPayload,
  UserDTO,
} from '@validation/auth.types';

export const loginUser = async (
  userRepository: UserRepository,
  tokenRepository: RefreshTokenRepository,
  input: LoginInput,
): Promise<{ user: UserDTO; tokens: AuthTokens }> => {
  const user = await userRepository.getUserByEmail(input.email);

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const payload: TokenPayload = {
    userId: user._id,
    email: user.email,
    roleId: user.roleId,
  };

  const tokens = createTokenPair(payload);

  await tokenRepository.storeRefreshToken({
    _id: new Types.ObjectId(),
    token: tokens.refreshToken,
    userId: user._id,
    expiresAt: parseExpiration(config.jwtRefreshExpiration),
    createdAt: new Date(),
    revoked: false,
  });

  const safeUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    active: user.active,
  };

  return { user: safeUser, tokens };
};
