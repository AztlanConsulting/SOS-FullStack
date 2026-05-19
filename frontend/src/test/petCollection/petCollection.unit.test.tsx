import PetCard from '@/features/petCollection/components/PetCard';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, test, vi } from 'vitest';

const navigateMock = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('State management and components', () => {
  test('renders PetCard with correct info', () => {
    const pet = {
      refId: '1234',
      image: 'base64str',
      species: 'Dog',
      color: 'brown',
      location: 'City',
      details: 'brown',
    };
    render(
      <MemoryRouter initialEntries={['/']}>
        <PetCard petInfo={pet} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Dog')).toBeDefined();
    expect(screen.getByText('City')).toBeDefined();

    const linkElement = screen.getByRole('link');
    expect(linkElement.getAttribute('href')).toBe(
      `/inicio/coleccion-mascotas/${pet.refId}`,
    );
  });
});
