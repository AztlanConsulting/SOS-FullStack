import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PlanProgressSection from '@/features/client/components/PlanProgressSection';
import type { PlanSubscriptionProgress } from '@/features/graphs/types/dashboardMetrics';

const planProgressMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');

  return {
    ...actual,
    useNavigate: () => planProgressMocks.navigate,
  };
});

vi.mock('@/features/graphs/components/CountDownChart', () => ({
  CountdownChart: ({ data }: { data: PlanSubscriptionProgress }) => (
    <div data-testid="countdown-chart">Plan {data.plans[0]?.name}</div>
  ),
}));

const petData: PlanSubscriptionProgress = {
  petId: 'pet-123',
  plans: [
    {
      name: 'Básico',
      duration: 30,
      createdAt: new Date('2026-05-01T00:00:00.000Z'),
    },
  ],
  petName: 'Firulais',
  petImage: null,
  planStatus: 'continua',
  posterImage: null,
  dateMissing: '2026-05-01',
  location: 'Parque Alameda',
};

describe('PlanProgressSection', () => {
  beforeEach(() => {
    planProgressMocks.navigate.mockReset();
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      media: '(min-width: 1024px)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('shows a message when there is no active plan', () => {
    render(<PlanProgressSection petData={null} />);

    expect(
      screen.getByText('No tienes un plan activo en este momento.'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('countdown-chart')).not.toBeInTheDocument();
  });

  it('shows the chart and navigates to extend the plan', () => {
    render(<PlanProgressSection petData={petData} />);

    expect(screen.getByTestId('countdown-chart')).toHaveTextContent(
      'Plan Básico',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Extender plan' }));

    expect(planProgressMocks.navigate).toHaveBeenCalledWith(
      '/inicio/extender-plan',
      { state: { petId: 'pet-123' } },
    );
  });

  it('opens the adviser chat in a new window', () => {
    const openMock = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<PlanProgressSection petData={petData} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Contacta con tu asesor' }),
    );

    expect(openMock).toHaveBeenCalledWith(
      'https://m.me/2444791512265246',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
