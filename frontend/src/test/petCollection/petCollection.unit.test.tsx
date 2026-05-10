import PetCard from '@/features/petCollection/components/PetCard';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, test } from 'vitest';

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
      <MemoryRouter>
        <PetCard petInfo={pet} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Dog')).toBeDefined();
    expect(screen.getByText('City')).toBeDefined();
  });
});
