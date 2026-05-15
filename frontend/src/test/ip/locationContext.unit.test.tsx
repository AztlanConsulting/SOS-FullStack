import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  LocationProvider,
  useLocationContext,
} from '@shared/context/Location.context';

const mockGetPricing = vi.fn();

vi.mock('@features/plans/services/pricing.service', () => ({
  getPricing: () => mockGetPricing(),
}));

const mockPricingResponse = {
  country: 'Mexico',
  currencyCode: 'MXN',
  plans: [
    {
      name: 'Básico',
      originalPrice: 23,
      localizedPrice: 402.5,
      currencyCode: 'MXN',
      exchangeRate: 17.5,
    },
    {
      name: 'Estándar',
      originalPrice: 49,
      localizedPrice: 857.5,
      currencyCode: 'MXN',
      exchangeRate: 17.5,
    },
    {
      name: 'Premium',
      originalPrice: 93,
      localizedPrice: 1627.5,
      currencyCode: 'MXN',
      exchangeRate: 17.5,
    },
  ],
  manuals: [
    {
      name: 'Manual básico',
      originalPrice: 199,
      localizedPrice: 3482.5,
      currencyCode: 'MXN',
      exchangeRate: 17.5,
    },
  ],
  workshops: [
    {
      name: 'Taller de búsqueda',
      originalPrice: 500,
      localizedPrice: 8750,
      currencyCode: 'MXN',
      exchangeRate: 17.5,
    },
  ],
};

// Consumer component to read context values in tests
const ContextConsumer = () => {
  const { country, currencyCode, exchangeRate, plans, loading, error } =
    useLocationContext();
  return (
    <div>
      <p data-testid="country">{country}</p>
      <p data-testid="currencyCode">{currencyCode}</p>
      <p data-testid="exchangeRate">{exchangeRate}</p>
      <p data-testid="plansCount">{plans.length}</p>
      <p data-testid="loading">{String(loading)}</p>
      <p data-testid="error">{error}</p>
    </div>
  );
};

describe('LocationContext', () => {
  beforeEach(() => {
    mockGetPricing.mockReset();
  });

  /**
   * SUCCESS CASE
   * Verifies context is populated with data from pricing service.
   */
  it('populates context with pricing data on success', async () => {
    mockGetPricing.mockResolvedValue(mockPricingResponse);

    render(
      <LocationProvider>
        <ContextConsumer />
      </LocationProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('country').textContent).toBe('Mexico');
    expect(screen.getByTestId('currencyCode').textContent).toBe('MXN');
    expect(screen.getByTestId('exchangeRate').textContent).toBe('17.5');
    expect(screen.getByTestId('plansCount').textContent).toBe('3');
  });

  /**
   * LOADING STATE
   * Verifies loading is true while fetching.
   */
  it('shows loading state while fetching', () => {
    mockGetPricing.mockReturnValue(new Promise(() => {}));

    render(
      <LocationProvider>
        <ContextConsumer />
      </LocationProvider>,
    );

    expect(screen.getByTestId('loading').textContent).toBe('true');
  });

  /**
   * ERROR STATE
   * Verifies error is set and defaults are kept when fetch fails.
   */
  it('sets error and keeps USD defaults when fetch fails', async () => {
    mockGetPricing.mockRejectedValue(new Error('Network error'));

    render(
      <LocationProvider>
        <ContextConsumer />
      </LocationProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('error').textContent).toBe(
      'Failed to fetch pricing information',
    );
    expect(screen.getByTestId('currencyCode').textContent).toBe('USD');
    expect(screen.getByTestId('exchangeRate').textContent).toBe('1');
  });

  /**
   * THROWS OUTSIDE PROVIDER
   * Verifies useLocationContext throws when used outside LocationProvider.
   */
  it('throws when used outside LocationProvider', () => {
    // Suppress console.error for this test
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<ContextConsumer />)).toThrow(
      'useLocation must be used within a LocationProvider',
    );

    vi.restoreAllMocks();
  });
});
