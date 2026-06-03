export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface PasswordResetResponse {
  message: string;
  expiresAt?: string;
}

export interface ValidateResetTokenResponse {
  valid: boolean;
}
