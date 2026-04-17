import type { User } from '@domain/models/user.model';
import type { Types } from 'mongoose';

export type UserDTO = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  roleId: Types.ObjectId;
  active: boolean;
};

export interface TokenPayload {
  userId: User['_id'];
  email: string;
  roleId: User['roleId'];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
