import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { createElement, type ReactNode } from 'react';

import { RoleProtectedRoute } from '@routes/RoleProtectedRoute';
import { AuthContext } from '@features/auth/hooks/AuthProvider';

// Infer real context type from React context
type AuthContextValue = React.ContextType<typeof AuthContext>;

// Renders component with real AuthContext + router integration
const renderWithAuth = (
  authValue: Partial<AuthContextValue>,
  ui: ReactNode,
) => {
  // Create in-memory router for navigation testing
  const router = createMemoryRouter(
    [
      { path: '/', element: ui },
      { path: '/login', element: <h1>Login</h1> },
      { path: '/forbidden', element: <h1>Forbidden</h1> },
    ],
    { initialEntries: ['/'] },
  );

  // Build full context value by filling missing fields safely
  const fullAuthValue: AuthContextValue = {
    user: null,
    isAuthLoading: false,
    loading: false,
    error: null,
    setError: () => {},
    login: () => Promise.resolve(false),
    logout: () => Promise.resolve(),
    ...authValue,
  };

  // Wrap app with Auth provider
  const tree = createElement(
    AuthContext.Provider,
    { value: fullAuthValue },
    <RouterProvider router={router} />,
  );

  return render(tree);
};

describe('RoleProtectedRoute integration', () => {
  it('shows loading state while auth is initializing', () => {
    renderWithAuth(
      {
        user: null,
        isAuthLoading: true,
      },
      <RoleProtectedRoute allowedRoles={['admin']}>
        <div>Protected</div>
      </RoleProtectedRoute>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithAuth(
      {
        user: null,
        isAuthLoading: false,
      },
      <RoleProtectedRoute allowedRoles={['admin']}>
        <div>Protected</div>
      </RoleProtectedRoute>,
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('redirects to forbidden when user role is not allowed', () => {
    renderWithAuth(
      {
        user: {
          id: '1',
          username: 'test',
          email: 'test@mail.com',
          role: 'user',
          active: true,
        },
        isAuthLoading: false,
      },
      <RoleProtectedRoute allowedRoles={['admin']}>
        <div>Protected</div>
      </RoleProtectedRoute>,
    );

    expect(screen.getByText('Forbidden')).toBeInTheDocument();
  });

  it('renders protected content when user is authorized', () => {
    renderWithAuth(
      {
        user: {
          id: '1',
          username: 'test',
          email: 'test@mail.com',
          role: 'admin',
          active: true,
        },
        isAuthLoading: false,
      },
      <RoleProtectedRoute allowedRoles={['admin']}>
        <div>Protected</div>
      </RoleProtectedRoute>,
    );

    expect(screen.getByText('Protected')).toBeInTheDocument();
  });
});
