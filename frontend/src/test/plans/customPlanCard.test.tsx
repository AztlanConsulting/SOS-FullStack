import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import CustomPlanCard from '@/features/plans/components/customPlanCard';

/**
 * Unit tests for the CustomPlanCard component.
 * Validates rendering, slider interactions, pricing logic,
 * extras toggles, and confirm button.
 */
describe('CustomPlanCard Component', () => {
  /**
   * Verifies the card header renders correctly.
   */
  test('renders header correctly', () => {
    render(<CustomPlanCard />);
    expect(screen.getByText('Personalizado')).toBeDefined();
  });

  /**
   * Verifies initial state renders with default values.
   * Initial days=3, km=5.
   */
  test('renders initial state with 3 días and 5 km', () => {
    render(<CustomPlanCard />);
    const diasElements = screen.getAllByText('3 días');
    const kmElements = screen.getAllByText('5 km');
    expect(diasElements.length).toBeGreaterThan(0);
    expect(kmElements.length).toBeGreaterThan(0);
  });

  /**
   * Verifies the days slider has correct min and max attributes.
   */
  test('days slider has correct min and max', () => {
    render(<CustomPlanCard />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders[0].getAttribute('min')).toBe('3');
    expect(sliders[0].getAttribute('max')).toBe('30');
  });

  /**
   * Verifies the km slider has correct min and max attributes.
   */
  test('km slider has correct min and max', () => {
    render(<CustomPlanCard />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders[1].getAttribute('min')).toBe('5');
    expect(sliders[1].getAttribute('max')).toBe('40');
  });

  /**
   * Verifies all features from ALL_FEATURES are rendered
   * including unavailable ones.
   */
  test('renders all extras including unavailable ones', () => {
    render(<CustomPlanCard />);
    expect(screen.getByText('Asesor de búsqueda')).toBeDefined();
    expect(screen.getByText('Geolocalización dinámica')).toBeDefined();
    expect(screen.getByText('Geolocalización doble')).toBeDefined();
    expect(screen.getByText('Reel de Instagram y Facebook')).toBeDefined();
  });

  /**
   * Verifies unavailable features show the correct message.
   * Days=3 is in tier 1-4 so all features are available — no unavailable message.
   * This test uses days=7 where asesor and geo_dinamica are unavailable.
   */
  test('shows unavailability message for features not in current tier', () => {
    render(<CustomPlanCard />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '7' } });
    const messages = screen.getAllByText(
      'No disponible con los días o km actuales.',
    );
    expect(messages.length).toBeGreaterThan(0);
  });

  /**
   * Verifies unavailable features show "No disponible" price label.
   */
  test('shows "No disponible" price for unavailable features', () => {
    render(<CustomPlanCard />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '7' } });
    const labels = screen.getAllByText('No disponible');
    expect(labels.length).toBeGreaterThan(0);
  });

  /**
   * Verifies price breakdown shows días and radio lines with toFixed(2).
   * 3 days * $80.00 + 5 km * $15.00
   */
  test('renders price breakdown with correct format', () => {
    render(<CustomPlanCard />);
    expect(screen.getByText(/Días \(3 x \$80\.00\)/)).toBeDefined();
    expect(screen.getByText(/Radio \(5 km x \$15\.00\)/)).toBeDefined();
  });

  /**
   * Verifies total price is displayed with 2 decimal places.
   * 3 days * $80 + 5 km * $15 = $315.00
   */
  test('renders correct initial total price', () => {
    render(<CustomPlanCard />);
    expect(screen.getByText('$315.00')).toBeDefined();
  });

  /**
   * Verifies the confirm button is present.
   */
  test('renders confirm button', () => {
    render(<CustomPlanCard />);
    expect(screen.getByText('Confirmar plan')).toBeDefined();
  });

  /**
   * Verifies confirm button calls console.log with correct shape.
   * Initial state: days=3, km=5, selectedFeatures=[], totalPrice=315
   */
  test('calls console.log with correct data when confirm is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(<CustomPlanCard />);
    await userEvent.click(screen.getByText('Confirmar plan'));
    expect(consoleSpy).toHaveBeenCalledWith({
      days: 3,
      km: 5,
      selectedFeatures: [],
      totalPrice: 315,
    });
    consoleSpy.mockRestore();
  });
});
