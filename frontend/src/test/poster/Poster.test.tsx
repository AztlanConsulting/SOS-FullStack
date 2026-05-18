import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { Poster } from '@/features/poster/components/Poster.component';
import type { LostPetReportData } from '@/shared/types/petReport.types';

describe('Poster component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:poster-image');
  });

  test('renders the poster title and image preview for a single uploaded photo', () => {
    const pet: LostPetReportData = {
      name: 'Luna',
      species: 'Perro',
      date: '2026-05-17',
      breed: 'Labrador',
      sex: 'Hembra',
      color: 'Café',
      size: 'Mediana: 11 a 25 kg',
      description: 'Usa un collar rosa',
      images: [new File(['content'], 'luna.jpg', { type: 'image/jpeg' })],
      imageLayout: '1',
      address: 'Centro de Monterrey',
      location: null,
      contactName: 'Ana Pérez',
      phoneNumber: '81 1234 5678',
      email: 'ana@example.com',
      planName: 'Básico',
    };

    const { container } = render(<Poster pet={pet} />);

    expect(screen.getByText('SE BUSCA A')).toBeDefined();
    expect(screen.getByText('LUNA')).toBeDefined();
    expect(URL.createObjectURL).toHaveBeenCalledWith(pet.images[0]);
    expect(container.querySelectorAll('img')).toHaveLength(4);
    expect(
      container.querySelector('img[src="blob:poster-image"]'),
    ).not.toBeNull();
  });
});
