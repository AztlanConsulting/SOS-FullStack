import '@testing-library/jest-dom/vitest';
import PurchaseDetails from '@/features/purchases/components/PurhcaseDetails';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

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
    content: 'Hola que hace',
    price: 399,
  };

  const mockPlan = {
    _id: '1234567890',
    name: 'Básico',
    price: 500,
    duration: '3 days',
    radius: '12 km',
    features: ['1', '2', '3'],
  };

  it('renders product details correctly when a product is provided', () => {
    render(<PurchaseDetails product={mockProduct} success={false} />);

    expect(screen.getByText('Detalles de la compra')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar:')).toBeInTheDocument();
    expect(screen.getByText('$399')).toBeInTheDocument();
  });

  it('renders plan details correctly when a plan is provided', () => {
    render(<PurchaseDetails plan={mockPlan} success={false} />);

    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('shows the ConfirmPaymentModal when success is true product', () => {
    render(<PurchaseDetails product={mockProduct} success={true} />);

    expect(screen.getByText('¡La compra ha sido exitosa!')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cerrar'));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('shows the ConfirmPaymentModal when success is true plan', () => {
    render(<PurchaseDetails plan={mockPlan} success={true} />);

    expect(
      screen.getByText('¡Su anuncio será publicado en unos minutos!'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cerrar'));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('applies secondary background color when a product is present', () => {
    const { container } = render(
      <PurchaseDetails product={mockProduct} success={false} />,
    );

    // Check for the bg-secondary class logic
    const detailContainer = container.querySelector('.bg-secondary');
    expect(detailContainer).toBeInTheDocument();
  });

  it('applies gray background color when a plan is present', () => {
    const { container } = render(
      <PurchaseDetails plan={mockPlan} success={false} />,
    );

    // Check for the gray background class logic
    const detailContainer = container.querySelector('.bg-gray-100');
    expect(detailContainer).toBeInTheDocument();
  });
});
