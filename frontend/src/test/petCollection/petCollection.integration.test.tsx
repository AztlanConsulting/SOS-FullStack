import { describe, test, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import axiosInstance from '@/shared/utils/axios';
import SearchPetsPage from '@/features/petCollection/components/SearchPetsPage';
import wrapper from '../utils/wrapper.util';

// Mock the axios instance
vi.mock('@/shared/utils/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock URL.createObjectURL (used in UploadPet for preview)
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
    // 1. Setup mock responses
    const mockPets = [
      {
        id: 1,
        species: 'Golden Retriever',
        location: 'Madrid',
        image: 'base64_1',
      },
      { id: 2, species: 'Husky', location: 'Barcelona', image: 'base64_2' },
    ];

    // First call is for findSimilarPets, second (or concurrent) for countPets
    (axiosInstance.post as any)
      .mockResolvedValueOnce({ data: mockPets })
      .mockResolvedValueOnce({ data: 1 });

    render(<SearchPetsPage />, { wrapper });

    // 2. Simulate file upload
    const file = new File(['hello'], 'dog.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Subir imagen/i) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    // 3. Verify Preview appears
    expect(screen.getByAltText('Previsualización')).toBeDefined();

    // 5. Wait for the data to be rendered in the list
    await waitFor(() => {
      expect(screen.getByText('Golden Retriever')).toBeDefined();
      expect(screen.getByText('Husky')).toBeDefined();
      expect(screen.getByText('Madrid')).toBeDefined();
    });

    // 6. Verify total of 2 cards were rendered
    const petCards = screen.getAllByAltText('Mascota encontrada');
    expect(petCards).toHaveLength(2);
  });

  test('updates results when searching within the gallery', async () => {
    const mockPetsInitial = [
      { id: 1, species: 'Cat', location: 'Paris', image: '...' },
    ];
    const mockPetsFiltered = [
      { id: 2, species: 'Siamese Cat', location: 'Paris', image: '...' },
    ];

    (axiosInstance.post as any)
      .mockResolvedValueOnce({ data: mockPetsInitial })
      .mockResolvedValueOnce({ data: 1 });

    render(<SearchPetsPage />, { wrapper });

    // Upload image to enable search
    const file = new File([''], 'cat.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Subir imagen/i), {
      target: { files: [file] },
    });

    await waitFor(() => expect(screen.getByText('Cat')).toBeDefined());

    // Mock next API call for the search term
    (axiosInstance.post as any).mockResolvedValueOnce({
      data: mockPetsFiltered,
    });

    // 3. Type into search input
    const searchInput = screen.getByPlaceholderText(/buscar/i); // Adjust based on your SearchInput placeholder
    fireEvent.change(searchInput, { target: { value: 'Siamese' } });

    // 4. Verify filtered result
    await waitFor(() => {
      expect(screen.getByText('Siamese Cat')).toBeDefined();
      expect(screen.queryByText('Cat (pure)')).toBeNull();
    });
  });

  test('displays error message when API fails', async () => {
    (axiosInstance.post as any).mockRejectedValue(new Error('Network Error'));

    render(<SearchPetsPage />, { wrapper });

    const file = new File([''], 'dog.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Subir imagen/i), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText(/Error cargando imágenes/i)).toBeDefined();
    });
  });
});
