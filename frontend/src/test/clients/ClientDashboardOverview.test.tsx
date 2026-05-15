import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import ClientDashboardOverview from '@pages/ClientDashboardOverview';

const mockNavigate = vi.fn();
const mockUseDashboardMetrics = vi.fn();

vi.mock('@/features/graphs/hooks/useDashboardMetrics', () => ({
  useDashboardMetrics: () => mockUseDashboardMetrics(),
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/features/client/components/PlanProgressSection', () => ({
  default: ({ petData }: { petData: unknown }) => (
    <div data-testid="plan-progress">{petData ? 'plan' : 'sin-plan'}</div>
  ),
}));

vi.mock('@/features/client/components/AdProgressSection', () => ({
  AdProgressSection: ({ posterUrl }: { posterUrl: string | null }) => (
    <div data-testid="ad-progress">{posterUrl ? posterUrl : 'sin-poster'}</div>
  ),
}));

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('ClientDashboardOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDashboardMetrics.mockReturnValue({
      metrics: null,
      loading: false,
      error: null,
    });
  });

  test('muestra loading mientras carga', () => {
    mockUseDashboardMetrics.mockReturnValue({
      metrics: null,
      loading: true,
      error: null,
    });

    renderWithRouter(<ClientDashboardOverview />);
    expect(screen.getByText('Cargando la información...')).toBeDefined();
  });

  test('muestra error cuando falla la carga', () => {
    mockUseDashboardMetrics.mockReturnValue({
      metrics: null,
      loading: false,
      error: 'Error de prueba',
    });

    renderWithRouter(<ClientDashboardOverview />);
    expect(screen.getByText('Error de prueba')).toBeDefined();
  });

  test('renderiza el portal exclusivo con datos del pet', () => {
    mockUseDashboardMetrics.mockReturnValue({
      loading: false,
      error: null,
      metrics: {
        planProgress: {
          planName: 'Básico',
          totalDays: 30,
          daysRemaining: 12,
          petName: 'Firulais',
          petImage: '/uploads/pet.jpg',
          posterImage: '/uploads/poster.jpg',
          dateMissing: '2026-05-01T00:00:00.000Z',
        },
        resources: [],
      },
    });

    renderWithRouter(<ClientDashboardOverview />);

    expect(screen.getByText('Portal exclusivo')).toBeDefined();
    expect(screen.getByText('Firulais')).toBeDefined();
    expect(screen.getByTestId('plan-progress')).toBeDefined();
    expect(screen.getByTestId('ad-progress')).toBeDefined();
  });

  test('navega a /portal-exclusivo al pulsar el botón', async () => {
    const user = userEvent.setup();

    mockUseDashboardMetrics.mockReturnValue({
      loading: false,
      error: null,
      metrics: {
        planProgress: {
          planName: 'Básico',
          totalDays: 30,
          daysRemaining: 12,
          petName: 'Firulais',
          petImage: '/uploads/pet.jpg',
          posterImage: '/uploads/poster.jpg',
          dateMissing: '2026-05-01T00:00:00.000Z',
        },
        resources: [],
      },
    });

    renderWithRouter(<ClientDashboardOverview />);
    await user.click(screen.getByText('Visita nuestro contenido exclusivo'));

    expect(mockNavigate).toHaveBeenCalledWith('/portal-exclusivo');
  });
});
