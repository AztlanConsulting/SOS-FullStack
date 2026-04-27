import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { Role } from '@domain/models/role.model';
import type { Permission } from '@domain/models/permission.model';

export interface User {
  _id: Types.ObjectId;
  roleId: Types.ObjectId;
  permissions?: Types.ObjectId[];
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

export type UserCreateInput = Omit<
  User,
  '_id' | 'createdAt' | 'updatedAt' | 'active'
>;

export type UserWithRole = Omit<User, 'roleId'> & {
  roleId: Pick<Role, '_id' | 'role'>;
};

export type UserWithPermissions = Omit<User, 'permissions' | 'roleId'> & {
  roleId: {
    permissions?: Permission[];
  };
  permissions?: Permission[];
};

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
    active: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<User>('Users', UserSchema);
