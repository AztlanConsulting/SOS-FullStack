import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ResourceModal } from '@features/resources/components/ResourceModal';
import { deleteResource } from '@features/resources/services/queryResources';

vi.mock('@features/resources/services/queryResources', () => ({
  deleteResource: vi.fn(),
}));

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

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function renderWithClient(ui: React.ReactElement, queryClient: QueryClient) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe('ResourceModal', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = makeQueryClient();
  });

  it('renders the selected resource details', () => {
    renderWithClient(
      <ResourceModal resource={resource} onClose={() => undefined} />,
      queryClient,
    );

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

      it('opens the confirmation modal when Eliminar is clicked', () => {
        renderWithClient(
          <ResourceModal resource={resource} onClose={() => undefined} />,
          queryClient,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

        expect(screen.getByText('Eliminar recurso')).toBeInTheDocument();
        expect(
          screen.getByText('¿Estas seguro de querer eliminar el taller?'),
        ).toBeInTheDocument();
      });

      it('closes the confirmation modal when Cancelar is clicked', () => {
        renderWithClient(
          <ResourceModal resource={resource} onClose={() => undefined} />,
          queryClient,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

        expect(screen.queryByText('Eliminar recurso')).not.toBeInTheDocument();
      });

      it('calls deleteResource, invalidates the query cache and closes the modal on confirm', async () => {
        vi.mocked(deleteResource).mockResolvedValueOnce(undefined);
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
        const onClose = vi.fn();

        renderWithClient(
          <ResourceModal resource={resource} onClose={onClose} />,
          queryClient,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
        fireEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }));

        await waitFor(() => {
          expect(deleteResource).toHaveBeenCalledWith('r1');
          expect(invalidateSpy).toHaveBeenCalledWith(
            expect.objectContaining({ queryKey: ['resources'] }),
          );
          expect(onClose).toHaveBeenCalled();
        });
      });

      it('shows an error message when deleteResource fails', async () => {
        vi.mocked(deleteResource).mockRejectedValueOnce(
          new Error('server error'),
        );

        renderWithClient(
          <ResourceModal resource={resource} onClose={() => undefined} />,
          queryClient,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
        fireEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }));

        await waitFor(() => {
          expect(
            screen.getByText('Error al eliminar el recurso. Intente de nuevo.'),
          ).toBeInTheDocument();
        });
      });
    });
  });
});
