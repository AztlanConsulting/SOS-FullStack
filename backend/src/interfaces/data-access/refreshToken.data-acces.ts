import { RefreshTokenModel } from '@domain/models/refreshToken.model';
import type { RefreshToken } from '@domain/models/refreshToken.model';
import type { RefreshTokenRepository } from '@domain/repositories/refreshToken.repository';
import type { Types } from 'mongoose';

export const refreshTokenDataAccess: RefreshTokenRepository = {
  async storeRefreshToken(token: RefreshToken): Promise<void> {
    await RefreshTokenModel.create(token);
  },

  async revokeAllUserTokens(userId: Types.ObjectId): Promise<void> {
    await RefreshTokenModel.updateMany(
      { userId, revoked: false },
      { $set: { revoked: true } },
    );
  },

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return await RefreshTokenModel.findOne({
      token,
      revoked: false,
    }).exec();
  },

  async revokeRefreshToken(token: string): Promise<void> {
    await RefreshTokenModel.updateOne({ token }, { $set: { revoked: true } });
  },
};
