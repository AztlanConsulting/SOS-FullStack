import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import MembersOnlyCard from '@features/members-only/components/MembersOnlyCard';
import type { MembersOnly } from '@features/members-only/types/membersOnly.types';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

const CARD: MembersOnly = {
  _id: 'abc123',
  name: 'Guía de búsqueda',
  duration: 15,
  content: 'Contenido de la guía',
  imageUrl: '/images/guia.jpg',
  pdfUrl: '/pdfs/guia.pdf',
  createdAt: '2024-06-15T00:00:00.000Z',
  updatedAt: '2024-06-20T00:00:00.000Z',
};

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('MembersOnlyCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the image with alt text from card name', () => {
    renderWithRouter(<MembersOnlyCard card={CARD} />);

    const img = screen.getByRole('img');
    expect(img.getAttribute('alt')).toBe('Guía de búsqueda');
  });

  test('renders the card name', () => {
    renderWithRouter(<MembersOnlyCard card={CARD} />);

    expect(screen.getByText('Guía de búsqueda')).toBeDefined();
  });

  test('renders the formatted date in es-MX locale', () => {
    renderWithRouter(<MembersOnlyCard card={CARD} />);

    expect(screen.getByText('14 jun 2024')).toBeDefined();
  });

  test('renders the Ver button', () => {
    renderWithRouter(<MembersOnlyCard card={CARD} />);

    expect(screen.getByText('Ver')).toBeDefined();
  });

  test('navigates to detail page on Ver click', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MembersOnlyCard card={CARD} />);

    await user.click(screen.getByText('Ver'));

    expect(mockNavigate).toHaveBeenCalledWith(
      '/inicio/contenido-exclusivo/page/abc123',
    );
  });
});
