import { render, screen, waitFor } from '@testing-library/react'; 
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { Poster } from '@/features/poster/components/Poster.component';
import type { LostPetReportData } from '@/shared/types/petReport.types';
import * as imageUtils from '@/shared/utils/imageToDataUrl'; 

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', MockResizeObserver);

vi.mock('@/shared/utils/staticAssetsToDataUrl', () => ({
  getStaticImageAsDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockStaticAsset'),
}));

describe('Poster component', () => {
  let processSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    processSpy = vi.spyOn(imageUtils, 'processFilesToDataURLs').mockResolvedValue(['blob:poster-image']);
  });

  test('renders the poster title and image preview for a single uploaded photo', async () => {
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

    expect(processSpy).toHaveBeenCalledWith(pet.images);

    await waitFor(() => {
      expect(
        container.querySelector('img[src="blob:poster-image"]'),
      ).not.toBeNull();
    });

    expect(container.querySelectorAll('img')).toHaveLength(4);
  });
});
