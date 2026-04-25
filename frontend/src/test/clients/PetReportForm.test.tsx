import { render, screen } from '@testing-library/react';
import { PetReportForm } from '@features/users/components/PetReportForm';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';

vi.mock('@features/users/components/PetLocationSection', () => ({
  PetLocationSection: ({ errors }: { errors: Record<string, string> }) => (
    <section>
      <div data-testid="mock-location-section">Sección de ubicación</div>
      {errors.address && <small>{errors.address}</small>}
    </section>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSetReportData = vi.fn();
vi.mock('@features/users/context/PetReportContext', () => ({
  usePetReport: () => ({
    setReportData: mockSetReportData,
    reportData: null,
  }),
}));

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

const VALID_INITIAL_DATA = {
  name: 'Firulais',
  species: 'Perro',
  date: '2020-06-15',
  breed: 'Labrador',
  sex: 'Macho' as const,
  color: 'Café',
  size: 'Mediana: 11 a 25 kg' as const,
  description: 'Perro amigable con collar azul',
  address: 'Calle Epigmenio González 500, Querétaro',
  images: [new File(['content'], 'perro.jpg', { type: 'image/jpeg' })],
  contactName: 'Juan Pérez',
  phoneNumber: '+52 442 123 4567',
  email: 'juan@example.com',
};

describe('PetReportForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  test('renders all form sections correctly', () => {
    renderWithRouter(<PetReportForm />);

    expect(screen.getByText('Información de la mascota')).toBeDefined();
    expect(screen.getByText('Fotos de la mascota')).toBeDefined();
    expect(screen.getByText('Dónde se perdió')).toBeDefined();
    expect(screen.getByText('Información de contacto')).toBeDefined();
    expect(screen.getByText('Contratar el servicio')).toBeDefined();
  });

  test('renders correctly with pre-filled initialData', () => {
    renderWithRouter(
      <PetReportForm
        initialData={{ name: 'Firulais', contactName: 'Juan Pérez' }}
      />,
    );

    expect(screen.getByDisplayValue('Firulais')).toBeDefined();
    expect(screen.getByDisplayValue('Juan Pérez')).toBeDefined();
  });

  test('shows validation errors for name, species and email when form is empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm />);

    await user.click(screen.getByText('Contratar el servicio'));

    expect(screen.getByText('Ingresa el nombre de tu mascota')).toBeDefined();
    expect(screen.getByText('Selecciona una especie')).toBeDefined();
    expect(screen.getByText('Ingresa un correo electrónico')).toBeDefined();
  });

  test('shows all required field errors when form is empty', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm />);

    await user.click(screen.getByText('Contratar el servicio'));

    expect(screen.getByText('Ingresa el nombre de tu mascota')).toBeDefined();
    expect(screen.getByText('Selecciona una especie')).toBeDefined();
    expect(screen.getByText('Selecciona una fecha')).toBeDefined();
    expect(screen.getByText('Ingresa una raza o tipo')).toBeDefined();
    expect(screen.getByText('Ingresa un color')).toBeDefined();
    expect(screen.getByText('Ingresa una ubicación')).toBeDefined();
    expect(screen.getByText('Falta la foto 1')).toBeDefined();
    expect(screen.getByText('Ingresa el nombre del dueño')).toBeDefined();
    expect(screen.getByText('Ingresa un número de teléfono')).toBeDefined();
    expect(screen.getByText('Ingresa un correo electrónico')).toBeDefined();
  });

  test('does not navigate when the form has errors', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm />);

    await user.click(screen.getByText('Contratar el servicio'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows invalid email format error when email is malformed', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <PetReportForm
        initialData={{ ...VALID_INITIAL_DATA, email: 'esto-no-es-un-correo' }}
      />,
    );

    await user.click(screen.getByText('Contratar el servicio'));

    expect(screen.getByText('Correo inválido')).toBeDefined();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows invalid email error for email without domain', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <PetReportForm
        initialData={{ ...VALID_INITIAL_DATA, email: 'usuario@' }}
      />,
    );

    await user.click(screen.getByText('Contratar el servicio'));

    expect(screen.getByText('Correo inválido')).toBeDefined();
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

    await user.click(screen.getByText('Contratar el servicio'));

    expect(screen.getByText('La fecha no puede ser futura')).toBeDefined();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('accepts today as a valid date', async () => {
    const user = userEvent.setup();

    const today = new Date().toLocaleDateString('en-CA');

    renderWithRouter(
      <PetReportForm initialData={{ ...VALID_INITIAL_DATA, date: today }} />,
    );

    await user.click(screen.getByText('Contratar el servicio'));

    expect(screen.queryByText('La fecha no puede ser futura')).toBeNull();
    expect(screen.queryByText('Selecciona una fecha')).toBeNull();
  });

  test('clears the name error when the name field is updated', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm />);

    await user.click(screen.getByText('Contratar el servicio'));
    expect(screen.getByText('Ingresa el nombre de tu mascota')).toBeDefined();

    const nameInput = screen.getByLabelText('Nombre de la mascota');
    await user.type(nameInput, 'Firulais');

    expect(screen.queryByText('Ingresa el nombre de tu mascota')).toBeNull();
  });

  test('clears the breed error when the breed field is updated', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm />);

    await user.click(screen.getByText('Contratar el servicio'));
    expect(screen.getByText('Ingresa una raza o tipo')).toBeDefined();

    const breedInput = screen.getByLabelText('Raza/tipo de la mascota');
    await user.type(breedInput, 'Labrador');

    expect(screen.queryByText('Ingresa una raza o tipo')).toBeNull();
  });

  test('navigates to /report-confirmation when all fields are valid', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm initialData={VALID_INITIAL_DATA} />);

    await user.click(screen.getByText('Contratar el servicio'));

    expect(mockSetReportData).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/report-confirmation');
  });

  test('calls setReportData with the complete form data on success', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PetReportForm initialData={VALID_INITIAL_DATA} />);

    await user.click(screen.getByText('Contratar el servicio'));

    expect(mockSetReportData).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Firulais',
        species: 'Perro',
        email: 'juan@example.com',
      }),
    );
  });
});
