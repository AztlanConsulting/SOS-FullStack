import '@testing-library/jest-dom/vitest';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import usePurchase from '@/features/purchases/hooks/usePurchase';
import { PurchasePage } from '@/pages/PurchasePage';
import getProductImage from '@/features/purchases/services/getProductImage.service';
import { useLocation } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import wrapper from '../utils/wrapper.util';
import type { PetReportData } from '@/features/users/types/petReport.types';
import { usePetReport } from '@/features/users/context/PetReportContext';
import { useEffect } from 'react';
import TestComponent from '../utils/TestContextComponent';

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

const mockReportData: PetReportData = {
  name: 'Firulais',
  species: 'Perro',
  date: '2023-10-25',
  breed: 'Labrador',
  sex: 'Macho',
  color: 'Café',
  size: 'Mediana: 11 a 25 kg',
  description: 'Perro amigable',
  images: [],
  imageLayout: '1',
  address: 'Calle 123, Querétaro',
  location: null,
  locationCoords: undefined,
  contactName: 'Juan Pérez',
  phoneNumber: '+52 442 123 4567',
  email: 'juan@example.com',
  planName: 'Básico',
  planDetails: {
    days: 3,
    km: 12,
    selectedFeatures: ['feat 1', 'feat 2'],
    totalPrice: 500,
  },
};

const mockProduct = {
  _id: '123456789',
  imageUrl: 'img_url',
  name: 'manual',
  content: [{ content: 'Hola que hace', type: 'text' }],
  price: 399,
};

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

    // const {reportData, setReportData} = usePetReport()
    // Add context here
    // setReportData(mockReportData)

    render(<TestComponent mockRData={null} component={<PurchasePage />} />, {
      wrapper,
    });

    const manualName = await screen.findByText('manual');
    const price = await screen.findByText('$399');

    expect(manualName).toBeInTheDocument(); // Manual name
    expect(price).toBeInTheDocument();
  });

  it('loads page plan information', async () => {
    render(
      <TestComponent mockRData={mockReportData} component={<PurchasePage />} />,
      { wrapper },
    );

    const planName = await screen.findByText('Básico');
    const price = await screen.findByText('$500');

    expect(planName).toBeInTheDocument();
    expect(price).toBeInTheDocument();
  });
});
