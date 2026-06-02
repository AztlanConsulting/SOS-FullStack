import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ResourceCard from '@features/resources/components/ResourceCard';

describe('ResourceCard', () => {
  it('renders resource details and calls onClick with the selected resource', () => {
    const resource = {
      _id: 'r1',
      name: 'Taller de cuidado',
      type: 'Taller',
      price: 150,
      imageUrl: 'https://example.com/image.jpg',
      resourceUrl: 'https://example.com/video',
      content: [
        { type: 'text', content: 'Contenido principal' },
        { type: 'image', content: 'https://example.com/content.jpg' },
      ],
    };

    const onClick = vi.fn();

    render(<ResourceCard resource={resource} onClick={onClick} />);

    expect(screen.getByText('Taller')).toBeInTheDocument();
    expect(screen.getByText('Taller de cuidado')).toBeInTheDocument();
    expect(screen.getByText('Contenido principal')).toBeInTheDocument();
    expect(screen.getByText('$150 USD')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Taller de cuidado'));

    expect(onClick).toHaveBeenCalledWith(resource);
  });
});
