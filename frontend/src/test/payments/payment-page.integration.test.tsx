import '@testing-library/jest-dom/vitest';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import usePurchase from '@/features/purchases/hooks/usePurchase';
import { PurchasePage } from '@/pages/PurchasePage';
import getProductImage from '@/features/purchases/services/getProductImage.service';
import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';

const navigateMock = vi.fn();
// Replace useNavigate so we can assert route targets and payloads.
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: () => navigateMock,
  };
});
vi.mock('@/features/purchases/services/getProductImage.service');
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockStateManual = {
  userEmail: 'buyer@example.com',
  productId: 'm9',
  productType: 'manual',
  price: '399',
};
const mockStatePlan = {
  productType: 'plan',
  userEmail: 'test@mail.com',
  planDetails: {
    _id: '1234567890',
    name: 'Básico',
    price: '500',
    duration: '3 days',
    radius: '12 km',
    features: ['1', '2', '3'],
  },
};

const mockProduct = {
  _id: '123456789',
  imageUrl: 'img_url',
  name: 'manual',
  content: 'Hola que hace',
  price: 399,
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Prevents vitest from waiting for retries on failure
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('usePurchase', () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it('generates location state, hook and query', async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: mockStateManual,
      key: 'test-key',
      pathname: '/compra',
      search: '',
      hash: '',
      unstable_mask: undefined,
    });

    vi.mocked(getProductImage).mockResolvedValue(mockProduct);

    const { result } = renderHook(() => usePurchase(), { wrapper });

    act(() => {
      result.current.successHook[1](true);
    });

    await waitFor(() => expect(result.current.query.isLoading).toBe(false));

    expect(result.current.query.data).toBe(mockProduct);
  });

  it('loads page manual information', async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: mockStateManual,
      key: 'test-key',
      pathname: '/compra',
      search: '',
      hash: '',
      unstable_mask: undefined,
    });

    vi.mocked(getProductImage).mockResolvedValue(mockProduct);
    vi.mocked(useAuth).mockReturnValue({
      user: { username: 'Test User' },
      isAuthLoading: false,
    } as any);

    render(<PurchasePage />, { wrapper });

    const manualName = await screen.findByText('manual');
    const price = await screen.findByText('$399');

    expect(manualName).toBeInTheDocument(); // Manual name
    expect(price).toBeInTheDocument();
  });

  it('loads page plan information', async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: mockStatePlan,
      key: 'test-key',
      pathname: '/compra',
      search: '',
      hash: '',
      unstable_mask: undefined,
    });

    vi.mocked(getProductImage).mockResolvedValue(mockProduct);

    render(<PurchasePage />, { wrapper });

    const planName = await screen.findByText('Básico');
    const price = await screen.findByText('$500');

    expect(planName).toBeInTheDocument(); // Plan name
    expect(price).toBeInTheDocument();
  });
});
