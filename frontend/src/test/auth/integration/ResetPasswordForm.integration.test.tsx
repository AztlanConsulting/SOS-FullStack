import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ResetPasswordForm } from '@features/auth/components/ResetPasswordForm';

const { mockResetPasswordRequest, mockValidateResetToken } = vi.hoisted(() => ({
  mockResetPasswordRequest: vi.fn(),
  mockValidateResetToken: vi.fn(),
}));

vi.mock('@features/auth/services/auth.service', () => ({
  resetPasswordRequest: mockResetPasswordRequest,
  validateResetToken: mockValidateResetToken,
}));

const renderResetPasswordForm = (
  initialEntry = '/recuperar-contrasena?token=valid-token',
) => {
  const router = createMemoryRouter(
    [
      {
        path: '/recuperar-contrasena',
        element: <ResetPasswordForm />,
      },
      {
        path: '/olvide-contrasena',
        element: <h1>Forgot password</h1>,
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
    { initialEntries: [initialEntry] },
  );

  return render(<RouterProvider router={router} />);
};

describe('ResetPasswordForm integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateResetToken.mockResolvedValue({ valid: true });
  });

  /**
   * Verifies that expired or invalid links show the recovery state.
   */
  test('shows the invalid-link state when token validation fails', async () => {
    mockValidateResetToken.mockRejectedValue({
      response: { data: { message: 'Link invalido o expirado' } },
    });

    renderResetPasswordForm('/recuperar-contrasena?token=expired-token');

    expect(
      await screen.findByText('Link invalido o expirado'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /solicitar nuevo enlace/i }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that weak passwords show bullet errors and block submission.
   */
  test('shows password policy errors as bullet points and does not submit', async () => {
    const user = userEvent.setup();
    renderResetPasswordForm();

    await screen.findByLabelText(/^nueva contraseña$/i);
    await user.type(screen.getByLabelText(/^nueva contraseña$/i), 'abc');
    await user.type(
      screen.getByLabelText(/repite tu nueva contraseña/i),
      'abc',
    );
    await user.click(
      screen.getByRole('button', { name: /confirmar nueva contraseña/i }),
    );

    expect(
      screen.getByText(/• Debe tener al menos 12 caracteres/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/• Debe incluir una letra mayúscula/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/• Debe incluir un número/i)).toBeInTheDocument();
    expect(screen.getByText(/• Debe incluir un símbolo/i)).toBeInTheDocument();
    expect(mockResetPasswordRequest).not.toHaveBeenCalled();
  });

  /**
   * Verifies that different password values are rejected locally.
   */
  test('shows mismatch error and does not submit different passwords', async () => {
    const user = userEvent.setup();
    renderResetPasswordForm();

    await screen.findByLabelText(/^nueva contraseña$/i);
    await user.type(
      screen.getByLabelText(/^nueva contraseña$/i),
      'Contraseña123!',
    );
    await user.type(
      screen.getByLabelText(/repite tu nueva contraseña/i),
      'Contraseña123?',
    );
    await user.click(
      screen.getByRole('button', { name: /confirmar nueva contraseña/i }),
    );

    expect(
      screen.getByText('Las contraseñas no coinciden'),
    ).toBeInTheDocument();
    expect(mockResetPasswordRequest).not.toHaveBeenCalled();
  });

  /**
   * Verifies that secure matching passwords navigate back to login.
   */
  test('submits secure matching passwords and navigates back to login', async () => {
    const user = userEvent.setup();
    mockResetPasswordRequest.mockResolvedValue({
      message: 'Contraseña cambiada correctamente',
    });

    renderResetPasswordForm();

    await screen.findByLabelText(/^nueva contraseña$/i);
    await user.type(
      screen.getByLabelText(/^nueva contraseña$/i),
      'Contraseña123!',
    );
    await user.type(
      screen.getByLabelText(/repite tu nueva contraseña/i),
      'Contraseña123!',
    );
    await user.click(
      screen.getByRole('button', { name: /confirmar nueva contraseña/i }),
    );

    await waitFor(() => {
      expect(mockResetPasswordRequest).toHaveBeenCalledWith(
        'valid-token',
        'Contraseña123!',
        'Contraseña123!',
      );
    });
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });
});
