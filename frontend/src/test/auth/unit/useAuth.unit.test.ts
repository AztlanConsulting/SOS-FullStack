import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AuthContext } from '@features/auth/hooks/AuthProvider';
import { createElement, type ReactNode } from 'react';

// Mock context value used for testing
const mockContextValue = {
  user: {
    id: '1',
    username: 'testuser',
    email: 'test@mail.com',
    role: 'user',
    active: true,
  },
  loading: false,
  isAuthLoading: false,
  error: null,
  setError: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
};

// Wrapper must return a valid React element (required by renderHook)
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(AuthContext.Provider, {
    value: mockContextValue,
    children,
  });

describe('useAuth hook (exhaustive)', () => {
  it('throws error when used outside provider', () => {
    // Hook must fail when used without AuthProvider
    expect(() => renderHook(() => useAuth())).toThrow();
  });

  it('returns full auth context', () => {
    // Render hook with mocked AuthProvider wrapper
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Validate returned user data
    expect(result.current.user?.email).toBe('test@mail.com');

    // Ensure auth actions are available
    expect(result.current.login).toBeDefined();
    expect(result.current.logout).toBeDefined();
    expect(result.current.setError).toBeDefined();
  });
});
