import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import PlansPage from '@/pages/Plans';
import wrapper from '../utils/wrapper.util';

const mockUseLocationContext = vi.fn();
const mockUsePlans = vi.fn();

vi.mock('@shared/context/Location.context', () => ({
  useLocationContext: () => mockUseLocationContext(),
  LocationProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@features/plans/hooks/usePlans', () => ({
  usePlans: () => mockUsePlans(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

const mockPlans = [
  {
    _id: '1',
    name: 'Básico',
    price: '402.50',
    currency: 'MXN',
    duration: '3 días',
    radius: '10 km',
    highlighted: false,
    features: [{ label: 'Publicación en redes sociales', included: true }],
    onSelect: vi.fn(),
  },
  {
    _id: '2',
    name: 'Estándar',
    price: '857.50',
    currency: 'MXN',
    duration: '7 días',
    radius: '30 km',
    highlighted: true,
    badge: 'El más popular',
    features: [{ label: 'Publicación en redes sociales', included: true }],
    onSelect: vi.fn(),
  },
];

describe('PlansPage with localized pricing', () => {
  beforeEach(() => {
    mockUseLocationContext.mockReset();
    mockUsePlans.mockReset();

    mockUseLocationContext.mockReturnValue({
      currencyCode: 'MXN',
      exchangeRate: 17.5,
      plans: [],
      manuals: [],
      workshops: [],
      country: 'Mexico',
      loading: false,
      error: null,
    });
  });

  /**
   * LOADING STATE
   * Verifies loading message is shown while plans are being fetched.
   */
  it('renders loading state', () => {
    mockUsePlans.mockReturnValue({ plans: [], loading: true, error: null });

    render(<PlansPage />, { wrapper });

    expect(screen.getByText('Cargando planes...')).toBeInTheDocument();
  });

  /**
   * ERROR STATE
   * Verifies error message is shown when plans fail to load.
   */
  it('renders error state', () => {
    mockUsePlans.mockReturnValue({
      plans: [],
      loading: false,
      error: 'Failed',
    });

    render(<PlansPage />, { wrapper });

    expect(screen.getByText('Error al cargar los planes.')).toBeInTheDocument();
  });

  /**
   * LOCALIZED PRICES
   * Verifies plan names and localized prices are rendered correctly.
   */
  it('renders plans with localized prices', () => {
    mockUsePlans.mockReturnValue({
      plans: mockPlans,
      loading: false,
      error: null,
    });

    render(<PlansPage />, { wrapper });

    expect(screen.getByText('Básico')).toBeInTheDocument();
    expect(screen.getByText('Estándar')).toBeInTheDocument();
    expect(screen.getAllByText('MXN').length).toBeGreaterThan(0);
  });

  /**
   * EMPTY STATE
   * Verifies empty message is shown when no plans exist.
   */
  it('renders empty state when no plans', () => {
    mockUsePlans.mockReturnValue({ plans: [], loading: false, error: null });

    render(<PlansPage />, { wrapper });

    expect(screen.getByText('No se encontraron planes.')).toBeInTheDocument();
  });
});
