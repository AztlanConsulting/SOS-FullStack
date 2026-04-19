import axiosInstance from '@shared/utils/axios';
import type { LoginResponse } from '../types/auth.types';

export const loginRequest = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post('/auth/login', {
    email,
    password,
  });

  return data;
};

export const logoutRequest = async () => {
  await axiosInstance.post('/auth/logout');
};
