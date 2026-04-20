import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ManualsListSection } from '@features/manuals/components/ManualsListSection';

const mockUseProduct = vi.fn();

// Mock data-fetching hook so each test can force a precise UI state.
vi.mock('@shared/hooks/useProduct', () => ({
  default: () => mockUseProduct(),
}));

// Child components are mocked to keep this suite focused on section logic.
vi.mock('@shared/components/ui/Search', () => ({
  default: () => <div data-testid="search-component">Search</div>,
}));

vi.mock('@shared/components/ui/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading</div>,
}));

vi.mock('@shared/components/ui/Pagination', () => ({
  default: ({ pages }: { pages: { totalPages: number } }) => (
    <div data-testid="pagination">Pages: {pages.totalPages}</div>
  ),
}));

vi.mock('@shared/components/ui/List', () => ({
  default: ({ cards }: { cards: Array<{ name: string }> }) => (
    <ul data-testid="manuals-list">
      {cards.map((card) => (
        <li key={card.name}>{card.name}</li>
      ))}
    </ul>
  ),
}));

describe('ManualsListSection', () => {
  beforeEach(() => {
    // Reset return values and calls before every scenario.
    mockUseProduct.mockReset();
  });

  it('renders loading state', () => {
    mockUseProduct.mockReturnValue({
      searchHook: {
        setSearchTerm: vi.fn(),
        sortHook: ['Nombre (A-Z)', vi.fn()],
      },
      query: { isLoading: true, error: null, data: undefined },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    render(<ManualsListSection />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseProduct.mockReturnValue({
      searchHook: {
        setSearchTerm: vi.fn(),
        sortHook: ['Nombre (A-Z)', vi.fn()],
      },
      query: { isLoading: false, error: new Error('boom'), data: undefined },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    render(<ManualsListSection />);
    expect(
      screen.getByText('Error cargando resultados de búsqueda'),
    ).toBeInTheDocument();
  });

  it('renders empty state', () => {
    mockUseProduct.mockReturnValue({
      searchHook: {
        setSearchTerm: vi.fn(),
        sortHook: ['Nombre (A-Z)', vi.fn()],
      },
      query: {
        isLoading: false,
        error: null,
        data: {
          manuals: [],
          total: 0,
        },
      },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    render(<ManualsListSection />);
    expect(screen.getByText('No hay resultados...')).toBeInTheDocument();
  });

  it('renders manuals and pagination when data exists', () => {
    mockUseProduct.mockReturnValue({
      searchHook: {
        setSearchTerm: vi.fn(),
        sortHook: ['Nombre (A-Z)', vi.fn()],
      },
      query: {
        isLoading: false,
        error: null,
        data: {
          manuals: [
            {
              _id: 'm1',
              name: 'Manual 1',
              price: 10,
              content: '',
              imageUrl: '',
            },
            {
              _id: 'm2',
              name: 'Manual 2',
              price: 20,
              content: '',
              imageUrl: '',
            },
          ],
          total: 2,
        },
      },
      pages: { pageHook: [1, vi.fn()], visiblePages: [1], totalPages: 1 },
    });

    render(<ManualsListSection />);

    expect(screen.getByTestId('manuals-list')).toBeInTheDocument();
    expect(screen.getByText('Manual 1')).toBeInTheDocument();
    expect(screen.getByText('Manual 2')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
