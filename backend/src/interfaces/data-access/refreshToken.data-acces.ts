import { RefreshTokenModel } from '@domain/models/refreshToken.model';
import type { RefreshToken } from '@domain/models/refreshToken.model';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';
import type { Types } from 'mongoose';

export const refreshTokenDataAccess: RefreshTokenRepository = {
  /**
   * Stores a new refresh token in the database.
   * Used during login or token rotation.
   *
   * @param token - Refresh token entity to persist
   */
  async storeRefreshToken(token: RefreshToken): Promise<void> {
    await RefreshTokenModel.create(token);
  },

  /**
   * Revokes all active (non-revoked) tokens for a given user.
   * Useful for "logout from all devices" or security incidents.
   *
   * @param userId - User's ObjectId
   */
  async revokeAllUserTokens(userId: Types.ObjectId): Promise<void> {
    await RefreshTokenModel.updateMany(
      { userId, revoked: false },
      { $set: { revoked: true } },
    );
  },

  /**
   * Finds a valid (non-revoked) refresh token by its raw value.
   * Used during token refresh flow.
   *
   * @param token - Raw refresh token string
   * @return Matching refresh token if found, otherwise null
   */
  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return await RefreshTokenModel.findOne({
      token,
      revoked: false,
    }).exec();
  },

  /**
   * Revokes a specific refresh token.
   * Used during logout or token rotation.
   *
   * @param token - Raw refresh token string
   */
  async revokeRefreshToken(token: string): Promise<void> {
    await RefreshTokenModel.updateOne({ token }, { $set: { revoked: true } });
  },
};
