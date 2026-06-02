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
  /**
   * Creates or rotates a reset token only if the user's last token is old enough.
   *
   * The unique userId index prevents concurrent requests from creating
   * multiple reset links for the same user inside the 24-hour window.
   *
   * @param token - Token document data to persist
   * @param createdAfter - Earliest creation date still considered active
   * @return Whether a new reset link can be sent
   */
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

  /**
   * Finds the latest token created inside the cooldown window for a user.
   *
   * @param userId - User requesting password recovery
   * @param createdAfter - Earliest creation date still considered active
   * @return Recent token when one exists, otherwise null
   */
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

  /**
   * Finds an unused, unexpired reset token by hash.
   *
   * @param tokenHash - SHA-256 hash of the raw reset token
   * @param now - Current validation time
   * @return Matching reset token when valid, otherwise null
   */
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

  /**
   * Marks a reset token as consumed after a successful password update.
   *
   * @param tokenHash - SHA-256 hash of the raw reset token
   */
  async markTokenAsUsed(tokenHash: string): Promise<void> {
    await PasswordResetTokenModel.updateOne(
      { tokenHash, usedAt: null },
      { $set: { usedAt: new Date() } },
    ).exec();
  },
};
