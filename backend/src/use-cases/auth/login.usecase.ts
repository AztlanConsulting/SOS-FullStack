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

/**
 * Authenticates a user using email + password and issues JWT token pair.
 * Also persists the refresh token for session management.
 *
 * @param userRepository - Repository abstraction for user data access
 * @param tokenRepository - Repository abstraction for tokens data access
 * @param input - Login credentials (email + password)
 * @return Authenticated user (safe DTO) and JWT tokens
 */
export const loginUser = async (
  userRepository: UserRepository,
  tokenRepository: RefreshTokenRepository,
  input: LoginInput,
): Promise<{ user: UserDTO; tokens: AuthTokens }> => {
  const user = await userRepository.getUserByEmail(input.email);

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (!user.active) {
    throw new Error('USER_DEACTIVATED');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // JWT payload contains minimal identity + authorization context
  const payload: TokenPayload = {
    userId: user._id,
    email: user.email,
    roleId: user.roleId,
  };

  const refreshPayload = {
    ...payload,
    remember: input.remember,
  };

  const tokens = createTokenPair(payload, refreshPayload);

  // Persist refresh token to enable revocation and session tracking
  await tokenRepository.storeRefreshToken({
    _id: new Types.ObjectId(),
    token: tokens.refreshToken,
    userId: user._id,
    expiresAt: parseExpiration(config.jwtRefreshExpiration),
    createdAt: new Date(),
    revoked: false,
  });

  // Return only safe user fields
  const safeUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    roleId: user.roleId as Types.ObjectId,
    active: user.active,
  };

  return { user: safeUser, tokens };
};
