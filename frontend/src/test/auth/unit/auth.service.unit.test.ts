import { describe, it, expect, beforeEach, vi } from 'vitest';
import axiosInstance from '@shared/utils/axios';
import {
  loginRequest,
  logoutRequest,
  refreshRequest,
  meRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  validateResetToken,
} from '@features/auth/services/auth.service';
import * as tokenStorage from '@shared/utils/tokenStorage';

describe('auth service (integration)', () => {
  beforeEach(() => {
    // Reset all mocks and spies before each test
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('loginRequest sends correct payload and returns backend response', async () => {
    // Mock axios POST request for login
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValue({
      data: {
        user: { id: '1', email: 'test@mail.com' },
        accessToken: 'token-123',
      },
    });

    const res = await loginRequest('test@mail.com', 'pass', true);

    // Verify correct payload was sent to backend
    expect(postSpy).toHaveBeenCalledWith('/auth/login', {
      email: 'test@mail.com',
      password: 'pass',
      remember: true,
    });

    // Verify response mapping
    expect(res.accessToken).toBe('token-123');
    expect(res.user.email).toBe('test@mail.com');
  });

  it('loginRequest throws when backend fails', async () => {
    // Mock backend failure
    vi.spyOn(axiosInstance, 'post').mockRejectedValue(
      new Error('unauthorized'),
    );

    await expect(loginRequest('bad@mail.com', 'wrong', false)).rejects.toThrow(
      'unauthorized',
    );
  });

  it('logoutRequest calls backend endpoint', async () => {
    // Mock logout request
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValue({});

    await logoutRequest();

    // Verify logout endpoint was called
    expect(postSpy).toHaveBeenCalledWith('/auth/logout');
  });

  it('meRequest returns user from backend', async () => {
    // Mock current user request
    vi.spyOn(axiosInstance, 'get').mockResolvedValue({
      data: { user: { email: 'me@mail.com' } },
    });

    const res = await meRequest();

    // Verify user data is returned correctly
    expect(res.user.email).toBe('me@mail.com');
  });

  it('refreshRequest stores token and returns it', async () => {
    // Spy on token storage function
    const setTokenSpy = vi.spyOn(tokenStorage, 'setAccessToken');

    // Mock refresh endpoint response
    vi.spyOn(axiosInstance, 'post').mockResolvedValue({
      data: { accessToken: 'new-token' },
    });

    const res = await refreshRequest();

    // Verify token is stored
    expect(setTokenSpy).toHaveBeenCalledWith('new-token');

    // Verify response contains new token
    expect(res.accessToken).toBe('new-token');
  });

  it('refreshRequest propagates errors', async () => {
    // Mock refresh failure
    vi.spyOn(axiosInstance, 'post').mockRejectedValue(
      new Error('refresh failed'),
    );

    await expect(refreshRequest()).rejects.toThrow('refresh failed');
  });

  /**
   * Verifies that forgotPasswordRequest posts the email and maps the response.
   */
  it('forgotPasswordRequest sends the email payload and returns backend response', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValue({
      data: {
        message: 'email sent',
        expiresAt: '2026-06-05T00:00:00.000Z',
      },
    });

    const res = await forgotPasswordRequest('test@mail.com');

    expect(postSpy).toHaveBeenCalledWith('/auth/forgot-password', {
      email: 'test@mail.com',
    });
    expect(res.message).toBe('email sent');
    expect(res.expiresAt).toBe('2026-06-05T00:00:00.000Z');
  });

  /**
   * Verifies that token validation is sent through query parameters.
   */
  it('validateResetToken sends the token as query param', async () => {
    const getSpy = vi.spyOn(axiosInstance, 'get').mockResolvedValue({
      data: { valid: true },
    });

    const res = await validateResetToken('reset-token');

    expect(getSpy).toHaveBeenCalledWith('/auth/reset-password/validate', {
      params: { token: 'reset-token' },
    });
    expect(res.valid).toBe(true);
  });

  /**
   * Verifies that resetPasswordRequest sends both password fields.
   */
  it('resetPasswordRequest sends token and password confirmation payload', async () => {
    const postSpy = vi.spyOn(axiosInstance, 'post').mockResolvedValue({
      data: { message: 'password updated' },
    });

    const res = await resetPasswordRequest(
      'reset-token',
      'Contraseña123!',
      'Contraseña123!',
    );

    expect(postSpy).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'reset-token',
      newPassword: 'Contraseña123!',
      confirmPassword: 'Contraseña123!',
    });
    expect(res.message).toBe('password updated');
  });
});
