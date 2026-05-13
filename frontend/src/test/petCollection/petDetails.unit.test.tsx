import PetDetails from '@/features/petCollection/components/PetDetails';
import type { PetInfoDetailed } from '@/features/petCollection/types/petCollection.types';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, test, vi } from 'vitest';
import wrapper from '../utils/wrapper.util';

async function tempFoundPetDetails(id: string): Promise<PetInfoDetailed> {
  const petDetails: PetInfoDetailed = {
    refId: id,
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
  };
  return petDetails;
}
vi.mock(
  '@/features/petCollection/services/getFoundPetDetails.service',
  async () => {
    return tempFoundPetDetails;
  },
);

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
      <MemoryRouter>
        <PetDetails />
      </MemoryRouter>,
      { wrapper },
    );

    expect(screen.getByText('Dog')).toBeInTheDocument();
    expect(screen.getByText('Huskey')).toBeInTheDocument();
    expect(screen.getByText('Macho')).toBeInTheDocument();
    expect(screen.getByText('Blanco y negro')).toBeInTheDocument();
    expect(screen.getByText('Mini: 1 a 4 kg')).toBeInTheDocument();
    expect(screen.getByText('Querétaro México')).toBeInTheDocument();
    expect(screen.getByText('Juan Caballero')).toBeInTheDocument();
    expect(screen.getByText('+52 555 555 5555')).toBeInTheDocument();
    expect(screen.getByText('PowerRanger Rojo')).toBeInTheDocument();
    expect(
      screen.getByText('Ojo izquierdo color gris y derecho color café'),
    ).toBeInTheDocument();
  });
});
