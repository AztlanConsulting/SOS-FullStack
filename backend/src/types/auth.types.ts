import type { User } from '@domain/models/user.model';
import type { Types } from 'mongoose';

export type UserDTO = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  roleId: Types.ObjectId;
  active: boolean;
};

export type PermissionMap = Record<
  string,
  {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }
>;

export type PopulatedPermission = {
  resourceId: {
    name: string;
  };
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
};

export type UserPermissions = {
  roleId: {
    permissions: PopulatedPermission[];
  };
  permissions: PopulatedPermission[];
};

export interface TokenPayload {
  userId: User['_id'];
  email: string;
  roleId: User['roleId'];
}

export interface RefreshTokenPayload extends TokenPayload {
  remember: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
  remember: boolean;
}
