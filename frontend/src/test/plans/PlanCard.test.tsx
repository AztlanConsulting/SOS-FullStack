import { render, screen } from '@testing-library/react';
import PlanCard from '@features/plans/components/PlanCard';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockFeatures = [
  { label: 'Publicación en redes sociales', included: true },
  { label: 'Instagram Reel', included: false },
  {
    label: 'Asesor de busqueda',
    included: false,
    tooltipTitle: '¿Qué es el asesor de búsqueda?',
    tooltip: 'El asesor te ayudará con tus dudas.',
  },
];

const mockProps = {
  name: 'Básico',
  price: '390',
  duration: '3 días',
  radius: '10 km',
  features: mockFeatures,
  onSelect: vi.fn(),
};

describe('PlanCard Component', () => {
  test('renders plan name correctly', () => {
    render(<PlanCard {...mockProps} />);
    expect(screen.getByText('Básico')).toBeDefined();
  });

  test('renders plan price correctly', () => {
    render(<PlanCard {...mockProps} />);
    expect(screen.getByText(/\$?\s*390/)).toBeDefined();
  });

  test('renders duration and radius correctly', () => {
    render(<PlanCard {...mockProps} />);
    expect(screen.getByText('3 días / 10 km')).toBeDefined();
  });

  test('it wont render badge if not provided', () => {
    render(<PlanCard {...mockProps} />);
    expect(screen.queryByText('El más popular')).toBeNull();
  });

  test('calls onSelect when "Seleccionar" button is clicked', async () => {
    render(<PlanCard {...mockProps} />);
    await userEvent.click(screen.getByText('Seleccionar'));
    expect(mockProps.onSelect).toHaveBeenCalledTimes(1);
  });

  test('opens the modal with correct content when tooltip icon is clicked', async () => {
    render(<PlanCard {...mockProps} />);
    const tooltipBtn = screen.getAllByRole('button')[0];
    await userEvent.click(tooltipBtn);
    expect(screen.getByText('¿Qué es el asesor de búsqueda?')).toBeDefined();
  });

  test('closes the modal when close button is clicked', async () => {
    render(<PlanCard {...mockProps} />);
    const tooltipBtn = screen.getAllByRole('button')[0];
    await userEvent.click(tooltipBtn);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[buttons.length - 1]);
    expect(screen.queryByText('¿Qué es el asesor de búsqueda?')).toBeNull();
  });
});
