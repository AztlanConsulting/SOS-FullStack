import '@testing-library/jest-dom/vitest';
import PurchaseDetails from '@/features/purchases/components/PurchaseDetails';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import wrapper from '../utils/wrapper.util';
import type { PetReportData } from '@/features/users/types/petReport.types';

const navigateMock = vi.fn();

// Replace useNavigate so we can assert route targets and payloads.
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('PurchaseDetails', () => {
  const mockProduct = {
    _id: '123456789',
    imageUrl: 'img_url',
    name: 'manual',
    content: [{ content: 'Hola que hace', type: 'text' }],
    price: 399,
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

  it('renders product details correctly when a product is provided', () => {
    const { container } = render(
      <PurchaseDetails
        product={mockProduct}
        success={false}
        reportData={null}
      />,
      {
        wrapper,
      },
    );

    expect(screen.getByText('Detalles de la compra')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar:')).toBeInTheDocument();
    expect(screen.getByText('$399')).toBeInTheDocument();
    const detailContainer = container.querySelector('.bg-secondary');
    expect(detailContainer).toBeInTheDocument();
  });

  it('renders plan details correctly when a plan is provided', () => {
    const { container } = render(
      <PurchaseDetails reportData={mockReportData} success={false} />,
      {
        wrapper,
      },
    );

    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('Básico')).toBeInTheDocument();
    expect(screen.getByText('3 días')).toBeInTheDocument();
    const detailContainer = container.querySelector('.bg-gray-100');
    expect(detailContainer).toBeInTheDocument();
  });

  it('shows the ConfirmPaymentModal when success is true product', () => {
    render(
      <PurchaseDetails
        product={mockProduct}
        success={true}
        reportData={null}
      />,
      {
        wrapper,
      },
    );

    expect(screen.getByText('¡La compra ha sido exitosa!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cerrar'));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('shows the ConfirmPaymentModal when success is true plan', () => {
    render(<PurchaseDetails reportData={mockReportData} success={true} />, {
      wrapper,
    });

    expect(
      screen.getByText('¡Su anuncio será publicado en unos minutos!'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cerrar'));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
