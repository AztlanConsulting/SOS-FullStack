export interface User {
  _id: string;
  roleId: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  fbUser: string;
  conversation: string;
  active: string;
}

export interface Users {
  getUsers(page: number): User[];
}
