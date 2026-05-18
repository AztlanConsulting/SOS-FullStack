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
import { MemoryRouter, Route, Routes } from 'react-router';
import { PetGalleryProvider } from '@/features/petCollection/context/PetCollectionProvider';
import PetDetails from '@/features/petCollection/components/PetDetails';

vi.mock('@/shared/utils/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

global.URL.createObjectURL = vi.fn(() => 'mock-url');

const FullAppRouter = () => (
  <PetGalleryProvider>
    <Routes>
      <Route path="/inicio/coleccion-mascotas">
        <Route index element={<SearchPetsPage />} />
        <Route path=":id" element={<PetDetails />} />
      </Route>
    </Routes>
  </PetGalleryProvider>
);

const Container = () => (
  <PetGalleryProvider>
    <SearchPetsPage />
  </PetGalleryProvider>
);

describe('SearchPetsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows empty state initially', () => {
    render(<Container />, { wrapper });
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

    render(
      <MemoryRouter>
        <Container />
      </MemoryRouter>,
      { wrapper },
    );

    const file = new File(['hello'], 'dog.png', { type: 'image/png' });

    const input = screen.getByAltText('Cambiar imagen');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByAltText('Previsualización')).toBeDefined();

    await act(async () => {
      await fireEvent.click(screen.getByText('Filtro'));
      await fireEvent.click(screen.getByText('Buscar'));
    });

    expect(axiosInstance.post).toHaveBeenCalled();

    expect(await screen.findByText('Golden Retriever')).toBeDefined();
    expect(await screen.findByText('Husky')).toBeDefined();
    expect(await screen.findByText('Madrid')).toBeDefined();

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

    render(
      <MemoryRouter>
        <Container />
      </MemoryRouter>,
      { wrapper },
    );

    const file = new File(['hello'], 'dog.png', { type: 'image/png' });

    const input = screen.getByAltText('Cambiar imagen');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await act(async () => {
      await fireEvent.click(screen.getByText('Filtro'));
      await fireEvent.click(screen.getByText('Buscar'));
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

  test('navigate to pet details', async () => {
    const mockPets = [
      {
        refId: '123',
        species: 'Golden Retriever',
        location: 'Madrid',
        image: 'img1',
      },
      { refId: '456', species: 'Husky', location: 'Barcelona', image: 'img2' },
    ];

    const mockPetDetail = {
      refId: '123',
      species: 'Dog',
      breed: 'Huskey',
      date: new Date().toISOString(),
      sex: 'Macho',
      color: 'Blanco y negro',
      size: 'Mini: 1 a 4 kg',
      image: 'test_image/png',
      location: 'Querétaro México',
      contactName: 'Juan Caballero',
      phoneNumber: '+52 555 555 5555',
      email: 'PowerRanger Rojo',
      details: 'Ojo izquierdo color gris y derecho color café',
    };

    (axiosInstance.post as any).mockResolvedValue({ data: mockPets });
    (axiosInstance.get as any).mockResolvedValue({
      status: 200,
      data: mockPetDetail,
    });

    render(
      <MemoryRouter initialEntries={['/inicio/coleccion-mascotas']}>
        <FullAppRouter />
      </MemoryRouter>,
      { wrapper },
    );

    const file = new File(['hello'], 'dog.png', { type: 'image/png' });
    const input = screen.getByAltText('Cambiar imagen');

    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(screen.getByAltText('Previsualización')).toBeDefined();

    // Verify list appeared
    expect(await screen.findByText('Golden Retriever')).toBeDefined();
    expect(screen.getByText('Husky')).toBeDefined();

    const goldenCard = screen.getByText('Golden Retriever');

    await act(async () => {
      fireEvent.click(goldenCard);
    });

    // Verify we navigated — wait for the GET to resolve and data to render
    // Use actual fields from mockPetDetail, not placeholder values
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });

    expect(await screen.findByText('Juan Caballero')).toBeDefined();
    expect(await screen.findByText('Querétaro México')).toBeDefined();
    expect(
      await screen.findByText('Ojo izquierdo color gris y derecho color café'),
    ).toBeDefined();

    // --- Back Navigation ---
    const backBtn = screen.getByRole('button');
    fireEvent.click(backBtn);

    // Verify we returned to the list
    expect(await screen.findByText('Husky')).toBeDefined();
  });

  test('displays error message when API fails', async () => {
    (axiosInstance.post as any).mockRejectedValue(new Error('Network Error'));

    render(<Container />, { wrapper });

    const file = new File([''], 'dog.png', { type: 'image/png' });

    // FIX: "Subir imagen" is the label text before upload, consistent with DOM
    fireEvent.change(screen.getByAltText('Cambiar imagen'), {
      target: { files: [file] },
    });

    await act(async () => {
      await fireEvent.click(screen.getByText('Filtro'));
      await fireEvent.click(screen.getByText('Buscar'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Error cargando imágenes/i)).toBeDefined();
    });
  });
});
