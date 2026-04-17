import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  roleId: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  phone: string;
  fbUser?: string;
  conversation?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Roles',
      required: true,
    },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String },
    fbUser: { type: String },
    conversation: { type: String },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<User>('Users', UserSchema);
