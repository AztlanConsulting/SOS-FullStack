import { describe, it, expect, beforeEach, vi } from 'vitest';
import axiosInstance from '@shared/utils/axios';
import {
  loginRequest,
  logoutRequest,
  refreshRequest,
  meRequest,
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
});
