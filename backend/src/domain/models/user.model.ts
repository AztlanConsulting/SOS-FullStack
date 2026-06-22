import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { Role } from '@domain/models/role.model';
import type { Permission } from '@domain/models/permission.model';

/**
 * Public note visible to the client, containing optional text and image URL.
 */
export interface PublicNote {
  text?: string;
  image?: string;
}

/**
 * Core User Entity interface matching the persisted database document structure.
 */
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
  notes?: string;
  publicNote?: PublicNote;
}

/**
 * Data payload format required to construct and save a new User.
 * Strips auto-generated fields and default statuses.
 */
export type UserCreateInput = Omit<
  User,
  '_id' | 'createdAt' | 'updatedAt' | 'active'
>;
/**
 * Extended type representation containing population data for RBAC evaluation.
 * Swaps out the raw roleId ObjectId for selected properties from the Role model.
 */
export type UserWithRole = Omit<User, 'roleId'> & {
  roleId: Pick<Role, '_id' | 'role'>;
};

/**
 * Deeply populated type parsing user scopes, pulling permissions from both
 * inherited roles and direct user-level permission matrices.
 */
export type UserWithPermissions = Omit<User, 'permissions' | 'roleId'> & {
  roleId: {
    permissions?: Permission[];
  };
  permissions?: Permission[];
};

/**
 * Mongoose Data Schema definition defining indexes, types, and operational validation.
 */
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
    notes: { type: String, default: '' },
    publicNote: {
      text: { type: String, default: '' },
      image: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<User>('Users', UserSchema);
