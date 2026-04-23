import axios from 'axios';
import { getAccessToken, setAccessToken } from '@shared/utils/tokenStorage';

/**
 * Main Axios instance used for authenticated requests.
 * - Includes base configuration (baseURL, timeout, credentials).
 * - Automatically attaches access token if available.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 8000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

/**
 * Separate Axios client used exclusively for refreshing tokens.
 * This avoids interceptor loops when the refresh endpoint itself fails.
 */
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/**
 * Request interceptor
 * Attaches the access token (if present) to every outgoing request.
 *
 * @param config - Axios request configuration
 * @return Modified config with Authorization header if token exists
 */
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response interceptor
 * Handles token expiration automatically:
 * - Detects 401 errors with TOKEN_EXPIRED
 * - Requests a new access token using refresh token (cookie-based)
 * - Retries the original request with the new token
 *
 * If refresh fails:
 * - Clears stored access token
 * - Redirects user to login
 *
 * @param error - Axios error object
 * @return Retried request or rejected promise
 */
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
