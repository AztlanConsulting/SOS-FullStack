import PetDetails from '@/features/petCollection/components/PetDetails';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, test, vi } from 'vitest';
import wrapper from '../utils/wrapper.util';

vi.mock('@/features/petCollection/services/getFoundPetDetails.service', () => ({
  default: vi.fn().mockResolvedValue({
    refId: '123',
    species: 'Dog',
    breed: 'Huskey',
    date: new Date().toISOString(),
    sex: 'Macho',
    color: 'Blanco y negro',
    size: 'Mini: 1 a 4 kg',
    image: 'test_image/png',
    location: 'Querétaro México',
    contactName: 'Juan Caballero',
    phoneNumber: '+52 555 555 5555',
    email: 'PowerRanger Rojo',
    details: 'Ojo izquierdo color gris y derecho color café',
  }),
}));

const navigateMock = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('Load pet details', () => {
  test('Load pet details', async () => {
    render(
      <MemoryRouter initialEntries={['/inicio/coleccion-mascotas/123']}>
        <Routes>
          <Route
            path="/inicio/coleccion-mascotas/:id"
            element={<PetDetails />}
          />
        </Routes>
      </MemoryRouter>,
      { wrapper },
    );

    expect(await screen.findByText('Dog')).toBeDefined();
    expect(screen.findByText('Huskey')).toBeDefined();
    expect(screen.findByText('Macho')).toBeDefined();
    expect(screen.findByText('Blanco y negro')).toBeDefined();
    expect(screen.findByText('Mini: 1 a 4 kg')).toBeDefined();
    expect(screen.findByText('Querétaro México')).toBeDefined();
    expect(screen.findByText('Juan Caballero')).toBeDefined();
    expect(screen.findByText('+52 555 555 5555')).toBeDefined();
    expect(screen.findByText('PowerRanger Rojo')).toBeDefined();
    expect(
      screen.findByText('Ojo izquierdo color gris y derecho color café'),
    ).toBeDefined();

    const backButton = screen.getByRole('button');
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
