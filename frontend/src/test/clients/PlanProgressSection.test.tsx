import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import PlanProgressSection from '@/features/client/components/PlanProgressSection';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/features/graphs/components/CountDownChart', () => ({
  CountdownChart: () => <div data-testid="countdown-chart">chart</div>,
}));

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('PlanProgressSection', () => {
  test('muestra el mensaje cuando no hay plan activo', () => {
    renderWithRouter(<PlanProgressSection petData={null} />);
    expect(
      screen.getByText('No tienes un plan activo en este momento.'),
    ).toBeDefined();
  });

  test('muestra el chart y navega a extender plan', async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <PlanProgressSection
        petData={{
          planName: 'Básico',
          totalDays: 30,
          daysRemaining: 12,
          petName: 'Firulais',
          petImage: null,
          posterImage: null,
          dateMissing: '2026-05-01',
        }}
      />,
    );

    expect(screen.getByTestId('countdown-chart')).toBeDefined();
    await user.click(screen.getByText('Extender plan'));
    expect(mockNavigate).toHaveBeenCalledWith('/extender-plan');
  });
});
