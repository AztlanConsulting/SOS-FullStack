export interface User {
  id: string;
  username: string;
  email: string;
  roleId: string;
  active: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}
