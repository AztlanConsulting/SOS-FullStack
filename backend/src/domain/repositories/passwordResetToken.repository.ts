import type {
  PasswordResetToken,
  PasswordResetTokenCreateInput,
} from '@domain/models/passwordResetToken.model';
import type { Types } from 'mongoose';

export interface PasswordResetTokenRepository {
  createResetToken(
    token: PasswordResetTokenCreateInput,
    createdAfter: Date,
  ): Promise<boolean>;
  findRecentTokenByUser(
    userId: Types.ObjectId,
    createdAfter: Date,
  ): Promise<PasswordResetToken | null>;
  findValidToken(
    tokenHash: string,
    now: Date,
  ): Promise<PasswordResetToken | null>;
  markTokenAsUsed(tokenHash: string): Promise<void>;
}
