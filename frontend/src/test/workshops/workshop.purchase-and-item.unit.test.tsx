import '@testing-library/jest-dom/vitest';
import type * as ReactRouter from 'react-router';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import usePurchaseProduct from '@shared/hooks/usePurchaseProduct';
import WorkshopCard from '@features/workshop/components/WorkshopCard';
import type { Workshop } from '@features/workshop/types/workshop';
import { usePetReport } from '@/shared/context/PetReportContext';

const navigateMock = vi.fn();
vi.mock('@/features/users/context/PetReportContext', () => ({
  usePetReport: vi.fn(),
}));

// Mocks the LocationContext to provide default USD pricing values.
// Required because components using useLocationContext need a LocationProvider
// in scope — without this mock they throw "useLocation must be used within a LocationProvider".
// Uses USD defaults (exchangeRate: 1) so price assertions remain predictable across tests.
vi.mock('@shared/context/Location.context', () => ({
  useLocationContext: () => ({
    currencyCode: 'USD',
    exchangeRate: 1,
    plans: [],
    manuals: [],
    workshops: [],
    country: null,
    loading: false,
    error: null,
  }),
  LocationProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Replace useNavigate so we can assert route targets and payloads.
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof ReactRouter>('react-router');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});
vi.mock('@/shared/context/PetReportContext');
describe('usePurchaseProduct', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    vi.mocked(usePetReport).mockReturnValue({
      lostPetReportData: null,
      setLostPetReportData: vi.fn(),
      foundPetReportData: null,
      setFoundPetReportData: vi.fn(),
    });
  });

  it('shows validation error for invalid email', () => {
    const { result } = renderHook(() =>
      usePurchaseProduct({
        _id: 'w1',
        item: 'taller',
        price: 300,
        url: '/workshop',
      }),
    );

    act(() => {
      // Simulate submit with invalid email format.
      result.current.handleNameChange('Buyer Name');
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
      usePurchaseProduct({
        _id: 'w1',
        item: 'taller',
        price: 300,
        url: '/workshop',
      }),
    );

    act(() => {
      // Trigger initial validation error.
      result.current.handleNameChange('Buyer Name');
      result.current.handleProceedToPayment();
    });
    expect(result.current.emailError).toBe('');
    expect(result.current.nameError).toBe(
      'Ingresa nombre y apellido para contactarte',
    );

    act(() => {
      // Editing input should clear the previous error message.
      result.current.handleEmailChange('nuevo@email.com');
    });
    expect(result.current.emailError).toBe('');
  });

  it('navigates to purchase with trimmed email and workshop payload', () => {
    const { result } = renderHook(() =>
      usePurchaseProduct({
        _id: 'w1',
        item: 'taller',
        price: 300,
        url: '/workshop',
      }),
    );

    act(() => {
      result.current.handleNameChange('Buyer Name');
      result.current.handleEmailChange('  buyer@example.com  ');
    });

    act(() => {
      // Submitting valid input should route to purchase with normalized email.
      result.current.handleProceedToPayment();
    });

    expect(navigateMock).toHaveBeenCalledWith('/compra', {
      state: {
        userName: 'Buyer Name',
        userEmail: 'buyer@example.com',
        productId: 'w1',
        productType: 'taller',
        price: 300,
      },
    });
  });

  it('shows validation error when lastname is missing', () => {
    const { result } = renderHook(() =>
      usePurchaseProduct({
        _id: 'w1',
        item: 'taller',
        price: 300,
        url: '/workshop',
      }),
    );

    act(() => {
      result.current.handleNameChange('Buyer');
      result.current.handleEmailChange('buyer@example.com');
      result.current.handleProceedToPayment();
    });

    expect(result.current.nameError).toBe(
      'Ingresa nombre y apellido para contactarte',
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });
});

describe('WorkshopCard', () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it('renders workshop details and navigates on Ver click', () => {
    const workshop: Workshop = {
      _id: 'w1',
      name: 'Workshop de Prueba',
      price: 100,
      content: [{ content: 'Hola', type: 'text' }],
      imageUrl: 'https://example.com/workshop.jpg',
      description: 'workshop description',
      category: ['1', '2', '3'],
    };

    render(<WorkshopCard workshop={workshop} />);

    expect(screen.getByText('Workshop de Prueba')).toBeInTheDocument();
    expect(screen.getByText('MX$100')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Workshop de Prueba' }),
    ).toBeInTheDocument();

    // Ver button should open the detail route and pass workshop via location state.
    fireEvent.click(screen.getByRole('button', { name: 'Ver' }));

    expect(navigateMock).toHaveBeenCalledWith('/talleres/w1', {
      state: { workshop },
    });
  });
});
