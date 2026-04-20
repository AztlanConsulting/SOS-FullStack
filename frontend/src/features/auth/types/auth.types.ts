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
