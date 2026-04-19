import axiosInstance from '@shared/utils/axios';
import refreshClient from '@shared/utils/axios';
import type { LoginResponse, RefreshResponse } from '../types/auth.types';
import { setAccessToken } from '@shared/utils/tokenStorage';

let refreshPromise: Promise<RefreshResponse> | null = null;

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

export const refreshRequest = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then((res) => {
        setAccessToken(res.data.accessToken);
        return res.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const meRequest = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
};
