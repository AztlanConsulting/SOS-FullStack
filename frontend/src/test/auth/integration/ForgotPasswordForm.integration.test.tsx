import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ForgotPasswordForm } from '@features/auth/components/ForgotPasswordForm';

const { mockForgotPasswordRequest } = vi.hoisted(() => ({
  mockForgotPasswordRequest: vi.fn(),
}));

vi.mock('@features/auth/services/auth.service', () => ({
  forgotPasswordRequest: mockForgotPasswordRequest,
}));

const renderForgotPasswordForm = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/olvide-contrasena',
        element: <ForgotPasswordForm />,
      },
      {
        path: '/login',
        element: <h1>Login</h1>,
      },
      {
        path: '/',
        element: <h1>Home</h1>,
      },
    ],
    { initialEntries: ['/olvide-contrasena'] },
  );

  return render(<RouterProvider router={router} />);
};

describe('ForgotPasswordForm integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Verifies that the recovery form renders the expected inputs and action.
   */
  test('renders the recovery form', () => {
    renderForgotPasswordForm();

    expect(screen.getByText('Recuperar contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /enviar enlace de restablecimiento/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that invalid emails use the standard field error before submit.
   */
  test('shows the standard email error and does not submit invalid emails', async () => {
    const user = userEvent.setup();
    renderForgotPasswordForm();

    await user.type(screen.getByLabelText(/correo electrónico/i), 'invalid');
    await user.click(
      screen.getByRole('button', {
        name: /enviar enlace de restablecimiento/i,
      }),
    );

    expect(screen.getByText('Correo invalido')).toBeInTheDocument();
    expect(mockForgotPasswordRequest).not.toHaveBeenCalled();
  });

  /**
   * Verifies that empty email validation stays under the input only.
   */
  test('shows only the input error when email is empty', async () => {
    const user = userEvent.setup();
    renderForgotPasswordForm();

    await user.click(
      screen.getByRole('button', {
        name: /enviar enlace de restablecimiento/i,
      }),
    );

    expect(
      screen.getByText('Ingresa un correo electrónico'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('No se pudo enviar el enlace de restablecimiento.'),
    ).not.toBeInTheDocument();
    expect(mockForgotPasswordRequest).not.toHaveBeenCalled();
  });

  /**
   * Verifies that a valid email reaches the service and shows feedback.
   */
  test('submits a valid email and shows the response modal', async () => {
    const user = userEvent.setup();
    mockForgotPasswordRequest.mockResolvedValue({
      message:
        '¡Se ha enviado un link a tu correo! Revisa en las últimas entradas o en el spam.',
    });

    renderForgotPasswordForm();

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@test.com',
    );
    await user.click(
      screen.getByRole('button', {
        name: /enviar enlace de restablecimiento/i,
      }),
    );

    await waitFor(() => {
      expect(mockForgotPasswordRequest).toHaveBeenCalledWith('test@test.com');
    });
    expect(screen.getByText('¡Advertencia!')).toBeInTheDocument();
    expect(
      screen.getByText(/Se ha enviado un link a tu correo/i),
    ).toBeInTheDocument();
  });
});
