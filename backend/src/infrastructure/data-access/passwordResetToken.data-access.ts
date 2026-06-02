import { PasswordResetTokenModel } from '@domain/models/passwordResetToken.model';
import type {
  PasswordResetToken,
  PasswordResetTokenCreateInput,
} from '@domain/models/passwordResetToken.model';
import type { PasswordResetTokenRepository } from '@domain/repositories/passwordResetToken.repository';
import type { Types } from 'mongoose';

const isDuplicateKeyError = (error: unknown): boolean => {
  return (
    typeof error === 'object' &&
    error != null &&
    'code' in error &&
    error.code === 11000
  );
};

export const passwordResetTokenDataAccess: PasswordResetTokenRepository = {
  async createResetToken(
    token: PasswordResetTokenCreateInput,
    createdAfter: Date,
  ): Promise<boolean> {
    try {
      const result = await PasswordResetTokenModel.findOneAndUpdate(
        {
          userId: token.userId,
          $or: [
            { createdAt: { $lt: createdAfter } },
            { createdAt: { $exists: false } },
          ],
        },
        {
          $set: {
            email: token.email,
            tokenHash: token.tokenHash,
            expiresAt: token.expiresAt,
            usedAt: null,
            createdAt: new Date(),
          },
          $setOnInsert: {
            _id: token._id,
            userId: token.userId,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        },
      ).exec();

      return result != null;
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return false;
      }

      throw error;
    }
  },

  async findRecentTokenByUser(
    userId: Types.ObjectId,
    createdAfter: Date,
  ): Promise<PasswordResetToken | null> {
    return await PasswordResetTokenModel.findOne({
      userId,
      createdAt: { $gte: createdAfter },
    })
      .sort({ createdAt: -1 })
      .lean<PasswordResetToken>()
      .exec();
  },

  async findValidToken(
    tokenHash: string,
    now: Date,
  ): Promise<PasswordResetToken | null> {
    return await PasswordResetTokenModel.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: now },
    })
      .lean<PasswordResetToken>()
      .exec();
  },

  async markTokenAsUsed(tokenHash: string): Promise<void> {
    await PasswordResetTokenModel.updateOne(
      { tokenHash, usedAt: null },
      { $set: { usedAt: new Date() } },
    ).exec();
  },
};
