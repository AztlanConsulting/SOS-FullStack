import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResourcesListSection from '@features/resources/components/ResourcesListSection';

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const mockUseResourceFilter = vi.fn();

vi.mock('@features/resources/hooks/useResourceFilter', () => ({
  default: (...args: unknown[]) => mockUseResourceFilter(...args),
}));

vi.mock('@shared/components/ui/LoadingSpinner', () => ({
  default: () => <div data-testid="loading-spinner">Loading</div>,
}));

vi.mock('@features/resources/components/ResourceSearch', () => ({
  default: () => <div data-testid="resource-search">Search</div>,
}));

describe('ResourcesListSection', () => {
  it('renders loading state', () => {
    mockUseResourceFilter.mockReturnValue({
      searchHook: {
        handleSearch: vi.fn(),
        sortHook: ['Nombre (A-Z)', vi.fn()],
        typeHook: ['Todos', vi.fn()],
      },
      query: { isLoading: true, error: null, data: undefined },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    renderWithClient(<ResourcesListSection />);
    render(<ResourcesListSection />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseResourceFilter.mockReturnValue({
      searchHook: {
        handleSearch: vi.fn(),
        sortHook: ['Nombre (A-Z)', vi.fn()],
        typeHook: ['Todos', vi.fn()],
      },
      query: { isLoading: false, error: new Error('boom'), data: undefined },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    renderWithClient(<ResourcesListSection />);
    render(<ResourcesListSection />);

    expect(
      screen.getByText('Error cargando resultados de búsqueda, $boom'),
    ).toBeInTheDocument();
  });

  it('renders empty state', () => {
    mockUseResourceFilter.mockReturnValue({
      searchHook: {
        handleSearch: vi.fn(),
        sortHook: ['Nombre (A-Z)', vi.fn()],
        typeHook: ['Todos', vi.fn()],
      },
      query: {
        isLoading: false,
        error: null,
        data: { resources: [], total: 0 },
      },
      pages: { pageHook: [1, vi.fn()], visiblePages: [], totalPages: 0 },
    });

    renderWithClient(<ResourcesListSection />);
    render(<ResourcesListSection />);

    expect(screen.getByText('No hay resultados...')).toBeInTheDocument();
  });

  it('renders resources and opens the modal when a card is clicked', () => {
    const resource = {
      _id: 'r1',
      name: 'Recurso 1',
      type: 'Manual',
      price: 40,
      imageUrl: 'https://example.com/cover.jpg',
      resourceUrl: 'https://example.com/file.pdf',
      content: [{ type: 'text', content: 'Resumen del recurso' }],
    };

    mockUseResourceFilter.mockReturnValue({
      searchHook: {
        handleSearch: vi.fn(),
        sortHook: ['Nombre (A-Z)', vi.fn()],
        typeHook: ['Todos', vi.fn()],
      },
      query: {
        isLoading: false,
        error: null,
        data: { resources: [resource], total: 1 },
      },
      pages: { pageHook: [1, vi.fn()], visiblePages: [1], totalPages: 1 },
    });

    renderWithClient(<ResourcesListSection />);
    render(<ResourcesListSection />);

    expect(screen.getByText('Recurso 1')).toBeInTheDocument();
    expect(screen.getByText('Resumen del recurso')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Recurso 1'));

    expect(screen.getByText('Detalle del recurso')).toBeInTheDocument();
    expect(screen.getAllByText('Manual')).toHaveLength(2);
    expect(screen.getAllByText('$40 USD')).toHaveLength(2);
    expect(screen.getByTestId('resource-search')).toBeInTheDocument();
  });
});
