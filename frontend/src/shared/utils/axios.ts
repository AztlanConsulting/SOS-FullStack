import axios from 'axios';
import { getAccessToken, setAccessToken } from '@shared/utils/tokenStorage';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!original) return Promise.reject(error);

    if (
      error.response?.status === 401 &&
      error.response?.data?.error === 'TOKEN_EXPIRED'
    ) {
      original._retry = true;

      try {
        const res = await refreshClient.post('/auth/refresh');

        const newToken = res.data.accessToken;

        setAccessToken(newToken);

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(original);
      } catch (err) {
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
