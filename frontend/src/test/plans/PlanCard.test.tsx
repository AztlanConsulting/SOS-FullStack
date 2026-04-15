import { render, screen } from '@testing-library/react';
import PlanCard from '@features/plans/components/PlanCard';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

/**
 * Mock data representing the features included in a plan.
 * Used to verify conditional rendering of labels and tooltips.
 */
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

/**
 * Standard props for the PlanCard component.
 * Includes basic info and a mocked selection handler.
 */
const mockProps = {
  name: 'Básico',
  price: '390',
  duration: '3 días',
  radius: '10 km',
  features: mockFeatures,
  onSelect: vi.fn(),
};

/**
 * Unit tests for the PlanCard component.
 * Validates rendering of plan details, interaction handlers, and modal behavior.
 */
describe('PlanCard Component', () => {
  /**
   * Verifies that the plan title is rendered as provided in props.
   */
  test('renders plan name correctly', () => {
    render(<PlanCard {...mockProps} />);
    expect(screen.getByText('Básico')).toBeDefined();
  });

  /**
   * Verifies that the price is displayed.
   */
  test('renders plan price correctly', () => {
    render(<PlanCard {...mockProps} />);
    expect(screen.getByText(/\$?\s*390/)).toBeDefined();
  });

  /**
   * Checks the formatting of the combined duration and radius string.
   */
  test('renders duration and radius correctly', () => {
    render(<PlanCard {...mockProps} />);
    expect(screen.getByText('3 días / 10 km')).toBeDefined();
  });

  /**
   * Ensures the "Most Popular" badge is hidden by default if the badge prop is omitted.
   */
  test('it wont render badge if not provided', () => {
    render(<PlanCard {...mockProps} />);
    expect(screen.queryByText('El más popular')).toBeNull();
  });

  /**
   * Simulates a user clicking the primary action button to ensure the callback triggers.
   */
  test('calls onSelect when "Seleccionar" button is clicked', async () => {
    render(<PlanCard {...mockProps} />);
    await userEvent.click(screen.getByText('Seleccionar'));
    expect(mockProps.onSelect).toHaveBeenCalledTimes(1);
  });

  /**
   * Verifies that clicking an info/tooltip icon opens a modal with specific information.
   */
  test('opens the modal with correct content when tooltip icon is clicked', async () => {
    render(<PlanCard {...mockProps} />);
    const tooltipBtn = screen.getAllByRole('button')[0];
    await userEvent.click(tooltipBtn);
    expect(screen.getByText('¿Qué es el asesor de búsqueda?')).toBeDefined();
  });

  /**
   * Validates the modal's closing logic by interacting with the close button within the portal.
   */
  test('closes the modal when close button is clicked', async () => {
    render(<PlanCard {...mockProps} />);
    const tooltipBtn = screen.getAllByRole('button')[0];
    await userEvent.click(tooltipBtn);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[buttons.length - 1]);
    expect(screen.queryByText('¿Qué es el asesor de búsqueda?')).toBeNull();
  });
});
