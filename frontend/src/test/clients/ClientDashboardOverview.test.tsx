import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ClientDashboardOverview from '@/pages/ClientDashboardOverview';
import type { DashboardResponse } from '@/features/graphs/types/dashboardMetrics';

const dashboardMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  useDashboardMetrics: vi.fn(),
}));

vi.mock('@/features/graphs/hooks/useDashboardMetrics', () => ({
  useDashboardMetrics: dashboardMocks.useDashboardMetrics,
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');

  return {
    ...actual,
    useNavigate: () => dashboardMocks.navigate,
  };
});

vi.mock('@/features/client/components/PlanProgressSection', () => ({
  default: ({ petData }: { petData: unknown }) => (
    <div data-testid="plan-progress">{petData ? 'con-plan' : 'sin-plan'}</div>
  ),
}));

vi.mock('@/features/client/components/AdProgressSection', () => ({
  AdProgressSection: ({ posterUrl }: { posterUrl: string | null }) => (
    <div data-testid="ad-progress">{posterUrl ?? 'sin-poster'}</div>
  ),
}));

const planProgress = {
  planName: 'Básico',
  totalDays: 30,
  daysRemaining: 12,
  petName: 'Firulais',
  petImage: '/uploads/pet.jpg',
  posterImage: '/uploads/poster.jpg',
  dateMissing: '2026-05-01T12:00:00.000Z',
  location: 'Parque Alameda',
};

const dashboardMetrics: DashboardResponse = {
  planProgress,
};

describe('ClientDashboardOverview', () => {
  beforeEach(() => {
    dashboardMocks.navigate.mockReset();
    dashboardMocks.useDashboardMetrics.mockReset();
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');
  });

  it('shows the loading state', () => {
    dashboardMocks.useDashboardMetrics.mockReturnValue({
      metrics: null,
      loading: true,
      error: null,
    });

    render(<ClientDashboardOverview />);

    expect(screen.getByText('Cargando la información...')).toBeInTheDocument();
  });

  it('shows an error when loading fails', () => {
    dashboardMocks.useDashboardMetrics.mockReturnValue({
      metrics: null,
      loading: false,
      error: 'Error de prueba',
    });

    render(<ClientDashboardOverview />);

    expect(screen.getByText('Error de prueba')).toBeInTheDocument();
  });

  it('shows an empty-state message when metrics are missing', () => {
    dashboardMocks.useDashboardMetrics.mockReturnValue({
      metrics: null,
      loading: false,
      error: null,
    });

    render(<ClientDashboardOverview />);

    expect(screen.getByText('No se encontraron datos')).toBeInTheDocument();
  });

  it('renders the exclusive portal with pet information', () => {
    dashboardMocks.useDashboardMetrics.mockReturnValue({
      metrics: dashboardMetrics,
      loading: false,
      error: null,
    });

    render(<ClientDashboardOverview />);

    expect(screen.getByText('Portal exclusivo')).toBeInTheDocument();
    expect(screen.getByText('Firulais')).toBeInTheDocument();
    expect(screen.getByText(/Desde 01\/05\/2026/)).toBeInTheDocument();
    expect(screen.getByText(/Parque Alameda/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Firulais' })).toHaveAttribute(
      'src',
      'http://localhost:3000/uploads/pet.jpg',
    );
    expect(screen.getByTestId('plan-progress')).toHaveTextContent('con-plan');
    expect(screen.getByTestId('ad-progress')).toHaveTextContent(
      'http://localhost:3000/uploads/poster.jpg',
    );
  });

  it('uses the poster absolute URL when it is already complete', () => {
    dashboardMocks.useDashboardMetrics.mockReturnValue({
      metrics: {
        ...dashboardMetrics,
        planProgress: {
          ...planProgress,
          posterImage: 'https://cdn.test/poster.jpg',
        },
      },
      loading: false,
      error: null,
    });

    render(<ClientDashboardOverview />);

    expect(screen.getByTestId('ad-progress')).toHaveTextContent(
      'https://cdn.test/poster.jpg',
    );
  });

  it('formats midnight UTC dates without moving them to the previous day', () => {
    dashboardMocks.useDashboardMetrics.mockReturnValue({
      metrics: {
        ...dashboardMetrics,
        planProgress: {
          ...planProgress,
          dateMissing: '2026-05-01T00:00:00.000Z',
        },
      },
      loading: false,
      error: null,
    });

    render(<ClientDashboardOverview />);

    expect(screen.getByText(/Desde 01\/05\/2026/)).toBeInTheDocument();
  });

  it('shows a fallback when location is empty', () => {
    dashboardMocks.useDashboardMetrics.mockReturnValue({
      metrics: {
        ...dashboardMetrics,
        planProgress: {
          ...planProgress,
          location: '   ',
        },
      },
      loading: false,
      error: null,
    });

    render(<ClientDashboardOverview />);

    expect(screen.getByText(/ubicación no disponible/)).toBeInTheDocument();
  });

  it('navigates to the pet collection page', () => {
    dashboardMocks.useDashboardMetrics.mockReturnValue({
      metrics: dashboardMetrics,
      loading: false,
      error: null,
    });

    render(<ClientDashboardOverview />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Galería de mascotas' }),
    );

    expect(dashboardMocks.navigate).toHaveBeenCalledWith(
      '/inicio/coleccion-mascotas',
    );
  });
});
