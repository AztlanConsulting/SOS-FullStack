import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { Role } from '@domain/models/role.model';
import type { Permission } from '@domain/models/permmision.model';

export interface User {
  _id: Types.ObjectId;
  roleId: Types.ObjectId | Role;
  permissions?: (Types.ObjectId | Permission)[];
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
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permissions',
      },
    ],
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
