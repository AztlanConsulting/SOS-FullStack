import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { createElement, type ReactNode } from 'react';

// Component under test
import { LoginForm } from '@features/auth/components/LoginForm';
import { AuthContext } from '@features/auth/hooks/AuthProvider';

// Mock only backend layer (login service behavior)
const mockLogin = vi.fn();

// Real integration boundary using AuthContext provider
const mockContextValue = {
  user: null,
  loading: false,
  isAuthLoading: false,
  error: null,
  setError: vi.fn(),
  login: mockLogin,
  logout: vi.fn(),
};

// Auth provider wrapper for integration testing
const AuthWrapper = ({ children }: { children: ReactNode }) =>
  createElement(AuthContext.Provider, {
    value: mockContextValue,
    children,
  });

// Creates full app with real router integration
const renderApp = () => {
  // Define in-memory router for integration testing
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <LoginForm />,
      },
      {
        path: '/dashboard',
        element: <h1>Dashboard</h1>,
      },
    ],
    { initialEntries: ['/'] },
  );

  // Render app with Auth context provider
  return render(
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>,
  );
};

describe('LoginForm integration', () => {
  beforeEach(() => {
    // Reset mock state before each test
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderApp();

    // Verify form elements are displayed
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('prevents login when email is invalid', async () => {
    const user = userEvent.setup();

    renderApp();

    // Enter invalid email format
    await user.type(screen.getByLabelText(/correo electrónico/i), 'invalid');
    await user.type(screen.getByLabelText(/contraseña/i), '123456');

    // Attempt login
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify login is not triggered
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('prevents login when password is empty', async () => {
    const user = userEvent.setup();

    renderApp();

    // Enter only email
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@mail.com',
    );

    // Attempt login without password
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify login is not triggered
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('logs in and navigates to dashboard on success', async () => {
    const user = userEvent.setup();

    // Mock successful login response
    mockLogin.mockResolvedValue(true);

    renderApp();

    // Fill login form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@mail.com',
    );
    await user.type(screen.getByLabelText(/contraseña/i), '123456');

    // Submit form
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify login called with correct data
    expect(mockLogin).toHaveBeenCalledWith('test@mail.com', '123456', false);

    // Verify navigation to dashboard
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });

  it('does not navigate when login fails', async () => {
    const user = userEvent.setup();

    // Mock failed login response
    mockLogin.mockResolvedValue(false);

    renderApp();

    // Fill login form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@mail.com',
    );
    await user.type(screen.getByLabelText(/contraseña/i), '123456');

    // Submit form
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Verify dashboard is not shown
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
