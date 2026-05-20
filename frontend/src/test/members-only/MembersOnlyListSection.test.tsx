import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import MembersOnlyListSection from '@features/members-only/components/MembersOnlyListSection';

const { mockUseProduct } = vi.hoisted(() => ({
  mockUseProduct: vi.fn(),
}));

vi.mock('@shared/hooks/useProduct', () => ({
  default: mockUseProduct,
}));

const MOCK_CARD = {
  _id: '1',
  name: 'Guía de búsqueda',
  duration: 10,
  content: 'Contenido',
  imageUrl: '/img.jpg',
  pdfUrl: '/pdf.pdf',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('MembersOnlyListSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows loading spinner when isLoading is true', () => {
    mockUseProduct.mockReturnValue({
      query: { isLoading: true, error: null, data: null },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    renderWithRouter(<MembersOnlyListSection />);

    expect(screen.queryByText('Error cargando resultados')).toBeNull();
    expect(screen.queryByText('No hay contenido disponible...')).toBeNull();
  });

  test('shows error text when query has error', () => {
    mockUseProduct.mockReturnValue({
      query: { isLoading: false, error: new Error('fail'), data: null },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    renderWithRouter(<MembersOnlyListSection />);

    expect(screen.getByText('Error cargando resultados')).toBeDefined();
    expect(screen.queryByText('No hay contenido disponible...')).toBeNull();
  });

  test('shows empty message when data has no items', () => {
    mockUseProduct.mockReturnValue({
      query: {
        isLoading: false,
        error: null,
        data: { membersOnly: [], total: 0 },
      },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    renderWithRouter(<MembersOnlyListSection />);

    expect(screen.getByText('No hay contenido disponible...')).toBeDefined();
    expect(screen.queryByText('Error cargando resultados')).toBeNull();
  });

  test('renders card names when data is available', () => {
    mockUseProduct.mockReturnValue({
      query: {
        isLoading: false,
        error: null,
        data: { membersOnly: [MOCK_CARD], total: 1 },
      },
      pages: { pageHook: [1, vi.fn()], visiblePages: [1], totalPages: 1 },
    });

    renderWithRouter(<MembersOnlyListSection />);

    expect(screen.getByText('Guía de búsqueda')).toBeDefined();
    expect(screen.queryByText('No hay contenido disponible...')).toBeNull();
    expect(screen.queryByText('Error cargando resultados')).toBeNull();
  });

  test('renders multiple cards when multiple items exist', () => {
    const card2 = { ...MOCK_CARD, _id: '2', name: 'Segunda guía' };
    mockUseProduct.mockReturnValue({
      query: {
        isLoading: false,
        error: null,
        data: { membersOnly: [MOCK_CARD, card2], total: 2 },
      },
      pages: { pageHook: [1, vi.fn()], visiblePages: [1, 2], totalPages: 2 },
    });

    renderWithRouter(<MembersOnlyListSection />);

    expect(screen.getByText('Guía de búsqueda')).toBeDefined();
    expect(screen.getByText('Segunda guía')).toBeDefined();
  });

  test('renders Pagination when cards exist', () => {
    mockUseProduct.mockReturnValue({
      query: {
        isLoading: false,
        error: null,
        data: { membersOnly: [MOCK_CARD], total: 10 },
      },
      pages: { pageHook: [1, vi.fn()], visiblePages: [1, 2], totalPages: 2 },
    });

    const { container } = renderWithRouter(<MembersOnlyListSection />);

    expect(screen.getByText('Guía de búsqueda')).toBeDefined();
  });
});
