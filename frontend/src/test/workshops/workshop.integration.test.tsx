import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import WorkshopCard from '@features/workshop/components/WorkshopCard';
import type { Workshop } from '@features/workshop/types/workshop';
import WorkshopContent from '@features/workshop/components/WorkshopContent';

const workshop: Workshop = {
  _id: 'w1',
  name: 'Workshop Integration',
  price: 100,
  content: [
    {
      type: 'text',
      content: 'Contenido de prueba',
    },
  ],
  imageUrl: 'https://example.com/workshop.jpg',
  description: 'workshop description',
  category: ['1', '2', '3'],
};

function WorkshopDetailProbe() {
  // Probe component to assert location state after route navigation.
  const { state } = useLocation();
  return <h1>{state?.workshop?.name ?? 'No workshop'}</h1>;
}

function PurchaseStateProbe() {
  // Probe component to inspect final purchase payload in router state.
  const { state } = useLocation();
  return (
    <div>
      <p>email:{state?.userEmail}</p>
      <p>productId:{state?.productId}</p>
      <p>productType:{state?.productType}</p>
      <p>price:{state?.price}</p>
    </div>
  );
}

describe('workshops integration', () => {
  it('navigates from WorkshopCard to workshop detail route with location state', async () => {
    // In-memory router reproduces real route transitions without browser history.
    const router = createMemoryRouter(
      [
        {
          path: '/talleres',
          element: <WorkshopCard workshop={workshop} />,
        },
        {
          path: '/talleres/:id',
          element: <WorkshopDetailProbe />,
        },
      ],
      { initialEntries: ['/talleres'] },
    );

    render(<RouterProvider router={router} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver' }));

    expect(
      await screen.findByRole('heading', { name: 'Workshop Integration' }),
    ).toBeInTheDocument();
  });

  it('validates email and then navigates to purchase with trimmed data', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/talleres/w1',
          element: <WorkshopContent workshop={workshop} />,
        },
        {
          path: '/compra',
          element: <PurchaseStateProbe />,
        },
      ],
      { initialEntries: ['/talleres/w1'] },
    );

    render(<RouterProvider router={router} />);

    // First submit should fail with validation message.
    fireEvent.click(screen.getByRole('button', { name: 'Proceder al pago' }));
    expect(
      screen.getByText('Ingresa un correo electrónico válido.'),
    ).toBeInTheDocument();

    // Second submit with valid email should route to purchase state.
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: '  buyer@example.com  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Proceder al pago' }));

    await waitFor(() => {
      expect(screen.getByText('email:buyer@example.com')).toBeInTheDocument();
    });
    expect(screen.getByText('productId:w1')).toBeInTheDocument();
    expect(screen.getByText('productType:taller')).toBeInTheDocument();
    expect(screen.getByText('price:100')).toBeInTheDocument();
  });
});
