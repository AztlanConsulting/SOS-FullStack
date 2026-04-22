import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface RefreshToken {
  _id: Types.ObjectId;
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
}

const RefreshTokenSchema = new Schema<RefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<RefreshToken>(
  'RefreshToken',
  RefreshTokenSchema,
);
