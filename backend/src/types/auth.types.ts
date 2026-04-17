import type { User } from '@domain/models/user.model';

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
