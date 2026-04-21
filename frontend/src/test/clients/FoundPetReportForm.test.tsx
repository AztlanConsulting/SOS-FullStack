import { render, screen } from '@testing-library/react';
import { PetReportForm } from '@features/found-pet/components/PetReportForm';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';

const { mockNavigate, mockSetReportData, mockReportFoundPet } = vi.hoisted(
  () => ({
    mockNavigate: vi.fn(),
    mockSetReportData: vi.fn(),
    mockReportFoundPet: vi.fn(),
  }),
);

vi.mock('@features/found-pet/components/FoundLocation', () => ({
  PetLocationSection: () => (
    <div data-testid="mock-location-section">Dónde se encontró</div>
  ),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@features/found-pet/context/PetReportService', () => ({
  usePetReport: () => ({
    setReportData: mockSetReportData,
    reportData: null,
  }),
}));

vi.mock('@features/found-pet/services/foundPetApi', () => ({
  reportFoundPet: mockReportFoundPet,
}));

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

const VALID_INITIAL_DATA = {
  species: 'Perro',
  date: '2020-06-15',
  breed: 'Labrador',
  color: 'Café',
  address: 'Calle Epigmenio González 500, Querétaro',
  images: [new File(['content'], 'perro.jpg', { type: 'image/jpeg' })],
  contactName: 'Juan Pérez',
  phoneNumber: '+52 442 123 4567',
  email: 'juan@example.com',
};

describe('FoundPetReportForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReportFoundPet.mockResolvedValue(undefined);
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
    Element.prototype.scrollIntoView = vi.fn();
  });

  test('renders all form sections correctly', () => {
    renderWithRouter(<PetReportForm />);

    expect(screen.getByText('Información de la mascota')).toBeDefined();
    expect(screen.getByText('Fotos de la mascota')).toBeDefined();
    expect(screen.getByText('Dónde se encontró')).toBeDefined();
  });

  test('renders correctly with pre-filled initialData', () => {
    renderWithRouter(
      <PetReportForm
        initialData={{ contactName: 'Juan Pérez', breed: 'Labrador' }}
      />,
    );

    expect(screen.getByDisplayValue('Juan Pérez')).toBeDefined();
    expect(screen.getByDisplayValue('Labrador')).toBeDefined();
  });

  test('shows all required field errors when form is empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm />);

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(screen.getByText('¡Selecciona una especie!')).toBeDefined();
    expect(screen.getByText('¡Indícanos la fecha!')).toBeDefined();
    expect(screen.getByText('¡Falta raza o tipo!')).toBeDefined();
    expect(screen.getByText('¡Falta color!')).toBeDefined();
    expect(screen.getByText('¡Indica ubicación!')).toBeDefined();
    expect(screen.getByText('¡Sube al menos una foto!')).toBeDefined();
    expect(screen.getByText('¡Falta nombre del dueño!')).toBeDefined();
    expect(screen.getByText('¡Añade un número de teléfono!')).toBeDefined();
    expect(screen.getByText('¡Falta correo!')).toBeDefined();
  });

  test('shows validation errors for species, date and email when form is empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm />);

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(screen.getByText('¡Selecciona una especie!')).toBeDefined();
    expect(screen.getByText('¡Indícanos la fecha!')).toBeDefined();
    expect(screen.getByText('¡Falta correo!')).toBeDefined();
  });

  test('shows invalid email format error when email is malformed', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <PetReportForm
        initialData={{ ...VALID_INITIAL_DATA, email: 'esto-no-es-un-correo' }}
      />,
    );

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(screen.getByText('¡Correo inválido!')).toBeDefined();
  });

  test('shows invalid email error for email without domain', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <PetReportForm
        initialData={{ ...VALID_INITIAL_DATA, email: 'usuario@' }}
      />,
    );

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(screen.getByText('¡Correo inválido!')).toBeDefined();
  });

  test('shows future date error when date is in the future', async () => {
    const user = userEvent.setup();

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    renderWithRouter(
      <PetReportForm
        initialData={{ ...VALID_INITIAL_DATA, date: futureDateStr }}
      />,
    );

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(screen.getByText('¡La fecha no puede ser futura!')).toBeDefined();
  });

  test('accepts today as a valid date', async () => {
    const user = userEvent.setup();

    const today = new Date().toISOString().split('T')[0];

    renderWithRouter(
      <PetReportForm initialData={{ ...VALID_INITIAL_DATA, date: today }} />,
    );

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(screen.queryByText('¡La fecha no puede ser futura!')).toBeNull();
    expect(screen.queryByText('¡Indícanos la fecha!')).toBeNull();
  });

  test('clears the species error when the species field is updated', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm />);

    await user.click(screen.getByText('Reportar mascota encontrada'));
    expect(screen.getByText('¡Selecciona una especie!')).toBeDefined();
  });

  test('shows success message when all fields are valid', async () => {
    const user = userEvent.setup();
    mockReportFoundPet.mockResolvedValue(undefined);
    renderWithRouter(<PetReportForm initialData={VALID_INITIAL_DATA} />);

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(screen.getByText('¡Mascota reportada!')).toBeDefined();
  });

  test('calls setReportData with the complete form data on success', async () => {
    const user = userEvent.setup();
    mockReportFoundPet.mockResolvedValue(undefined);
    renderWithRouter(<PetReportForm initialData={VALID_INITIAL_DATA} />);

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(mockSetReportData).toHaveBeenCalledWith(
      expect.objectContaining({
        species: 'Perro',
        breed: 'Labrador',
        email: 'juan@example.com',
      }),
    );
  });

  test('does not navigate on success', async () => {
    const user = userEvent.setup();
    mockReportFoundPet.mockResolvedValue(undefined);
    renderWithRouter(<PetReportForm initialData={VALID_INITIAL_DATA} />);

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('does not render the form sections after successful submission', async () => {
    const user = userEvent.setup();
    mockReportFoundPet.mockResolvedValue(undefined);
    renderWithRouter(<PetReportForm initialData={VALID_INITIAL_DATA} />);

    await user.click(screen.getByText('Reportar mascota encontrada'));

    expect(screen.queryByText('Información de la mascota')).toBeNull();
  });
});
