import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CurrencyIndicator from '@/features/plans/components/currencyIndicator';

const mockUseLocationContext = vi.fn();

vi.mock('@shared/context/Location.context', () => ({
  useLocationContext: () => mockUseLocationContext(),
}));

describe('CurrencyIndicator', () => {
  /**
   * SUCCESS CASE
   * Verifies the currency code badge renders correctly.
   */
  it('renders currency code when no error', () => {
    mockUseLocationContext.mockReturnValue({
      currencyCode: 'MXN',
      error: null,
    });

    render(<CurrencyIndicator />);

    expect(screen.getByText('MXN')).toBeInTheDocument();
    expect(screen.getByText('Precios en')).toBeInTheDocument();
  });

  /**
   * ERROR STATE
   * Verifies nothing renders when there is an error.
   */
  it('renders nothing when there is an error', () => {
    mockUseLocationContext.mockReturnValue({
      currencyCode: 'USD',
      error: 'Failed to fetch pricing information',
    });

    const { container } = render(<CurrencyIndicator />);

    expect(container).toBeEmptyDOMElement();
  });

  /**
   * USD FALLBACK
   * Verifies USD is shown when no localization is available.
   */
  it('renders USD as fallback currency code', () => {
    mockUseLocationContext.mockReturnValue({
      currencyCode: 'USD',
      error: null,
    });

    render(<CurrencyIndicator />);

    expect(screen.getByText('USD')).toBeInTheDocument();
  });
});
