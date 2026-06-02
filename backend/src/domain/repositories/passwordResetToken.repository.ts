import type {
  PasswordResetToken,
  PasswordResetTokenCreateInput,
} from '@domain/models/passwordResetToken.model';
import type { Types } from 'mongoose';

export interface PasswordResetTokenRepository {
  /**
   * Creates or rotates a reset token only when the user is outside the cooldown.
   *
   * @param token - Token document data to persist
   * @param createdAfter - Earliest creation date still considered active
   * @return Whether a token was created or rotated
   */
  createResetToken(
    token: PasswordResetTokenCreateInput,
    createdAfter: Date,
  ): Promise<boolean>;

  /**
   * Finds the latest token created inside the cooldown window for a user.
   *
   * @param userId - User requesting password recovery
   * @param createdAfter - Earliest creation date still considered active
   */
  findRecentTokenByUser(
    userId: Types.ObjectId,
    createdAfter: Date,
  ): Promise<PasswordResetToken | null>;

  /**
   * Finds an unused, unexpired reset token by its hash.
   *
   * @param tokenHash - SHA-256 hash of the raw token
   * @param now - Current validation time
   */
  findValidToken(
    tokenHash: string,
    now: Date,
  ): Promise<PasswordResetToken | null>;

  /**
   * Marks a reset token as consumed after a successful password update.
   *
   * @param tokenHash - SHA-256 hash of the raw token
   */
  markTokenAsUsed(tokenHash: string): Promise<void>;
}
