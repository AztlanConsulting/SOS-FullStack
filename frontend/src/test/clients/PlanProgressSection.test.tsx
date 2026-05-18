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
    <div data-testid="countdown-chart">Plan {data.planName}</div>
  ),
}));

const petData: PlanSubscriptionProgress = {
  planName: 'Básico',
  totalDays: 30,
  daysRemaining: 12,
  petName: 'Firulais',
  petImage: null,
  posterImage: null,
  dateMissing: '2026-05-01',
  location: 'Parque Alameda',
};

describe('PlanProgressSection', () => {
  beforeEach(() => {
    planProgressMocks.navigate.mockReset();
  });

  afterEach(() => {
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

    expect(planProgressMocks.navigate).toHaveBeenCalledWith('/extender-plan');
  });

  it('opens the adviser chat in a new window', () => {
    const openMock = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<PlanProgressSection petData={petData} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Contacta con tu asesor' }),
    );

    expect(openMock).toHaveBeenCalledWith(
      'https://www.facebook.com/messages/t/SOSencontrandomascotas',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
