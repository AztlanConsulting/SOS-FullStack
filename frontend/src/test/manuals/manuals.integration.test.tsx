import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { ManualItem } from '@features/manuals/components/ManualItem';
import { ManualContent } from '@features/manuals/components/ManualContent';

const manual = {
  _id: 'm-42',
  name: 'Manual Integracion',
  price: 300,
  content: [
    {
      type: 'text',
      content: 'Contenido de prueba',
    },
  ],
  imageUrl: 'https://example.com/manual.jpg',
};

function ManualDetailProbe() {
  // Probe component to assert location state after route navigation.
  const { state } = useLocation();
  return <h1>{state?.manual?.name ?? 'No manual'}</h1>;
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

describe('manuals integration', () => {
  it('navigates from ManualItem to manual detail route with location state', async () => {
    // In-memory router reproduces real route transitions without browser history.
    const router = createMemoryRouter(
      [
        {
          path: '/manuales',
          element: <ManualItem manual={manual} />,
        },
        {
          path: '/manuales/:id',
          element: <ManualDetailProbe />,
        },
      ],
      { initialEntries: ['/manuales'] },
    );

    render(<RouterProvider router={router} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver' }));

    expect(
      await screen.findByRole('heading', { name: 'Manual Integracion' }),
    ).toBeInTheDocument();
  });

  it('validates email and then navigates to purchase with trimmed data', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/manuales/m-42',
          element: <ManualContent manual={manual} />,
        },
        {
          path: '/compra',
          element: <PurchaseStateProbe />,
        },
      ],
      { initialEntries: ['/manuales/m-42'] },
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
    expect(screen.getByText('productId:m-42')).toBeInTheDocument();
    expect(screen.getByText('productType:manual')).toBeInTheDocument();
    expect(screen.getByText('price:300')).toBeInTheDocument();
  });
});
