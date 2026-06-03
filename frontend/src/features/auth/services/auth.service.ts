import axiosInstance from '@shared/utils/axios';
import refreshClient from '@shared/utils/axios';
import type {
  LoginResponse,
  PasswordResetResponse,
  RefreshResponse,
  ValidateResetTokenResponse,
} from '../types/auth.types';
import { setAccessToken } from '@shared/utils/tokenStorage';

/**
 * Ensures that multiple requests triggering a refresh
 * do not create multiple network calls.
 */
let refreshPromise: Promise<RefreshResponse> | null = null;

/**
 * Sends login credentials to authenticate the user.
 *
 * @param email - User email
 * @param password - User password
 * @param remember - Whether to persist session longer
 * @return LoginResponse containing user data and access token
 */
export const loginRequest = async (
  email: string,
  password: string,
  remember: boolean,
): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post('/auth/login', {
    email,
    password,
    remember,
  });

  return data;
};

/**
 * Logs out the current user.
 * Invalidates refresh token on the server side.
 */
export const logoutRequest = async () => {
  await axiosInstance.post('/auth/logout');
};

/**
 * Refreshes the access token using the refresh token (cookie-based).
 *
 * Key behavior:
 * - Deduplicates concurrent refresh calls using `refreshPromise`
 * - Stores new access token in memory
 * - Resets promise once completed (success or failure)
 *
 * @return RefreshResponse containing new access token
 */
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

/**
 * Retrieves the currently authenticated user's profile.
 * Requires a valid access token.
 *
 * @return User profile data
 */
export const meRequest = async () => {
  const { data } = await axiosInstance.get('/auth/me');
  return data;
};

/**
 * Requests a password reset link for the provided email.
 *
 * @param email - User email associated with the account
 * @return Backend message and optional reset link expiration
 */
export const forgotPasswordRequest = async (
  email: string,
): Promise<PasswordResetResponse> => {
  const { data } = await axiosInstance.post('/auth/forgot-password', {
    email,
  });

  return data;
};

/**
 * Validates whether a password reset token is still usable.
 *
 * @param token - Raw reset token from the email link
 * @return Token validity response
 */
export const validateResetToken = async (
  token: string,
): Promise<ValidateResetTokenResponse> => {
  const { data } = await axiosInstance.get('/auth/reset-password/validate', {
    params: { token },
  });

  return data;
};

/**
 * Updates the user's password using a valid reset token.
 *
 * @param token - Raw reset token from the email link
 * @param newPassword - New password entered by the user
 * @param confirmPassword - Confirmation password entered by the user
 * @return Backend confirmation message
 */
export const resetPasswordRequest = async (
  token: string,
  newPassword: string,
  confirmPassword: string,
): Promise<PasswordResetResponse> => {
  const { data } = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
    confirmPassword,
  });

  return data;
};
