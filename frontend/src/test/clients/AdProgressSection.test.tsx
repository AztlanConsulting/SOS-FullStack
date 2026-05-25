import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdProgressSection } from '@/features/client/components/AdProgressSection';

const exportMocks = vi.hoisted(() => ({
  color: vi.fn(),
  blackAndWhite: vi.fn(),
}));

vi.mock('@/shared/services/posterExport.services', () => ({
  exportPosterAsPdfColor: exportMocks.color,
  exportPosterAsPdfBlackAndWhite: exportMocks.blackAndWhite,
}));

describe('AdProgressSection', () => {
  beforeEach(() => {
    exportMocks.color.mockReset();
    exportMocks.blackAndWhite.mockReset();
  });

  it('renders nothing when posterUrl is missing', () => {
    const { container } = render(<AdProgressSection posterUrl={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders the poster with crossorigin for export', () => {
    render(
      <AdProgressSection posterUrl="http://localhost:3000/uploads/poster.jpg" />,
    );

    const poster = screen.getByRole('img', {
      name: 'Póster de mascota perdida',
    });

    expect(poster).toHaveAttribute(
      'src',
      'http://localhost:3000/uploads/poster.jpg',
    );
    expect(poster).toHaveAttribute('crossorigin', 'anonymous');
  });

  it('triggers color and black-and-white poster downloads', () => {
    render(
      <AdProgressSection posterUrl="http://localhost:3000/uploads/poster.jpg" />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Descargar a Color' }));
    fireEvent.click(screen.getByRole('button', { name: 'Descargar en B/N' }));

    expect(exportMocks.color).toHaveBeenCalledWith(
      'http://localhost:3000/uploads/poster.jpg',
      'poster-mascota-color',
      'letter',
    );
    expect(exportMocks.blackAndWhite).toHaveBeenCalledWith(
      'http://localhost:3000/uploads/poster.jpg',
      'poster-mascota-bn',
      'letter',
    );
  });
});
