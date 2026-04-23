import '@testing-library/jest-dom/vitest';
import type * as ReactRouter from 'react-router';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useManualPurchase } from '@features/manuals/hooks/useManualPurchase';
import { ManualItem } from '@features/manuals/components/ManualItem';

const navigateMock = vi.fn();

// Replace useNavigate so we can assert route targets and payloads.
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof ReactRouter>('react-router');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('useManualPurchase', () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it('shows validation error for invalid email', () => {
    const { result } = renderHook(() =>
      useManualPurchase({ _id: 'm1', price: 250 }),
    );

    act(() => {
      // Simulate submit with invalid email format.
      result.current.handleEmailChange('correo-invalido');
      result.current.handleProceedToPayment();
    });

    expect(result.current.emailError).toBe(
      'Ingresa un correo electrónico válido.',
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('clears previous error when user edits email', () => {
    const { result } = renderHook(() =>
      useManualPurchase({ _id: 'm1', price: 250 }),
    );

    act(() => {
      // Trigger initial validation error.
      result.current.handleProceedToPayment();
    });
    expect(result.current.emailError).toBe(
      'Ingresa un correo electrónico válido.',
    );

    act(() => {
      // Editing input should clear the previous error message.
      result.current.handleEmailChange('nuevo@email.com');
    });
    expect(result.current.emailError).toBe('');
  });

  it('navigates to purchase with trimmed email and manual payload', () => {
    const { result } = renderHook(() =>
      useManualPurchase({ _id: 'm9', price: 399 }),
    );

    act(() => {
      result.current.handleEmailChange('  buyer@example.com  ');
    });

    act(() => {
      // Submitting valid input should route to purchase with normalized email.
      result.current.handleProceedToPayment();
    });

    expect(navigateMock).toHaveBeenCalledWith('/compra', {
      state: {
        userEmail: 'buyer@example.com',
        productId: 'm9',
        productType: 'manual',
        price: 399,
      },
    });
  });
});

describe('ManualItem', () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it('renders manual details and navigates on Ver click', () => {
    const manual = {
      _id: 'manual-77',
      name: 'Manual de Prueba',
      price: 129,
      content: 'Contenido',
      imageUrl: 'https://example.com/manual.jpg',
    };

    render(<ManualItem manual={manual} />);

    expect(screen.getByText('Manual de Prueba')).toBeInTheDocument();
    expect(screen.getByText('$ 129')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Manual de Prueba' }),
    ).toBeInTheDocument();

    // Ver button should open the detail route and pass manual via location state.
    fireEvent.click(screen.getByRole('button', { name: 'Ver' }));

    expect(navigateMock).toHaveBeenCalledWith('/manuales/manual-77', {
      state: { manual },
    });
  });
});
