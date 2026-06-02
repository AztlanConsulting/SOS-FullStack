import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResourceModal } from '@features/resources/components/ResourceModal';

describe('ResourceModal', () => {
  it('renders the selected resource details', () => {
    const resource = {
      _id: 'r1',
      name: 'Manual de cuidado',
      type: 'Manual',
      price: 80,
      imageUrl: 'https://example.com/cover.jpg',
      resourceUrl: 'https://example.com/file.pdf',
      emailContent: 'Contenido del correo',
      content: [
        { type: 'text', content: 'Primer bloque' },
        { type: 'image', content: 'https://example.com/detail.jpg' },
      ],
    };

    render(<ResourceModal resource={resource} onClose={() => undefined} />);

    expect(screen.getByText('Detalle del recurso')).toBeInTheDocument();
    expect(screen.getByText('Manual de cuidado')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
    expect(screen.getByText('$80 USD')).toBeInTheDocument();
    expect(screen.getByText('Primer bloque')).toBeInTheDocument();
    expect(screen.getByText('Contenido del correo')).toBeInTheDocument();
    expect(screen.getAllByAltText('Manual de cuidado')).toHaveLength(2);
  });
});
