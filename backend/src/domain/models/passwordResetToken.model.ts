import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface PasswordResetToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  email: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}

export type PasswordResetTokenCreateInput = Omit<
  PasswordResetToken,
  'createdAt' | 'usedAt'
> & {
  usedAt?: Date | null;
};

const PasswordResetTokenSchema = new Schema<PasswordResetToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  usedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
PasswordResetTokenSchema.index({ userId: 1, createdAt: -1 });

export const PasswordResetTokenModel = model<PasswordResetToken>(
  'PasswordResetToken',
  PasswordResetTokenSchema,
);
