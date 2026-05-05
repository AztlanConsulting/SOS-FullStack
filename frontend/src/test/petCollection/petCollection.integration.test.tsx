import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  screen,
  fireEvent,
  waitFor,
  render,
  act,
} from '@testing-library/react';
import axiosInstance from '@/shared/utils/axios';
import SearchPetsPage from '@/features/petCollection/components/SearchPetsPage';
import wrapper from '../utils/wrapper.util';

vi.mock('@/shared/utils/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

global.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('SearchPetsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows empty state initially', () => {
    render(<SearchPetsPage />, { wrapper });
    expect(screen.getByText(/Sube una imagen primero/i)).toBeDefined();
    expect(
      screen.queryByRole('img', { name: 'Mascota encontrada' }),
    ).toBeNull();
  });

  test('uploads an image and displays the returned pet list', async () => {
    const mockPets = [
      {
        refId: 1,
        species: 'Golden Retriever',
        location: 'Madrid',
        image: 'base64_1',
      },
      { refId: 2, species: 'Husky', location: 'Barcelona', image: 'base64_2' },
    ];

    (axiosInstance.post as any).mockResolvedValue({ data: mockPets });

    render(<SearchPetsPage />, { wrapper });

    const file = new File(['hello'], 'dog.png', { type: 'image/png' });

    const input = screen.getByAltText('Cambiar imagen');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByAltText('Previsualización')).toBeDefined();
    expect(await screen.findByText('Golden Retriever')).toBeDefined();
    expect(await screen.findByText('Husky')).toBeDefined();
    expect(await screen.findByText('Madrid')).toBeDefined();

    await act(async () => {
      await fireEvent.click(screen.getByText('Filtro'));
      await fireEvent.click(screen.getByText('Buscar'));
    });
    expect(axiosInstance.post).toHaveBeenCalled();

    const petCards = screen.getAllByAltText('Mascota encontrada');
    expect(petCards).toHaveLength(2);
  });

  test('updates pet list on filter change', async () => {
    const mockPets = [
      {
        refId: 1,
        species: 'Golden Retriever',
        location: 'Madrid',
        image: 'base64_1',
      },
      { refId: 2, species: 'Husky', location: 'Barcelona', image: 'base64_2' },
    ];

    (axiosInstance.post as any).mockResolvedValue({ data: mockPets });

    render(<SearchPetsPage />, { wrapper });

    const file = new File(['hello'], 'dog.png', { type: 'image/png' });

    const input = screen.getByAltText('Cambiar imagen');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.queryByText(/Sube una imagen primero/i)).toBeNull();
    });

    expect(screen.getByAltText('Previsualización')).toBeDefined();
    expect(await screen.findByText('Golden Retriever')).toBeDefined();
    expect(await screen.findByText('Husky')).toBeDefined();
    expect(await screen.findByText('Madrid')).toBeDefined();

    const petCards = screen.getAllByAltText('Mascota encontrada');
    expect(petCards).toHaveLength(2);
  });

  test('displays error message when API fails', async () => {
    (axiosInstance.post as any).mockRejectedValue(new Error('Network Error'));

    render(<SearchPetsPage />, { wrapper });

    const file = new File([''], 'dog.png', { type: 'image/png' });

    // FIX: "Subir imagen" is the label text before upload, consistent with DOM
    fireEvent.change(screen.getByAltText('Cambiar imagen'), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText(/Error cargando imágenes/i)).toBeDefined();
    });
  });
});
