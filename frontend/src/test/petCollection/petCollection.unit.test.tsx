import PetCard from '@/features/petCollection/components/PetCard';
import { render, screen } from '@testing-library/react';
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
    render(<PetCard petInfo={pet} />);
    expect(screen.getByText('Dog')).toBeDefined();
    expect(screen.getByText('City')).toBeDefined();
  });
});
