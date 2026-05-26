import { render, screen, waitFor } from '@testing-library/react';
import { ReportConfirmationPage } from '@pages/ReportConfirmation';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import * as React from 'react';
import type { LostPetReportData } from '@/shared/types/petReport.types';

const posterExportMocks = vi.hoisted(() => ({
  exportPosterAsFile: vi.fn(),
}));

vi.mock('@/shared/services/posterExport.services', () => ({
  exportPosterAsFile: posterExportMocks.exportPosterAsFile,
}));

class MockResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

vi.stubGlobal('ResizeObserver', MockResizeObserver);

vi.mock('@/shared/services/posterExport.services', () => ({
  exportPosterAsFile: vi
    .fn()
    .mockResolvedValue(
      new File(['poster'], 'poster.png', { type: 'image/png' }),
    ),
}));

vi.mock('@features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    isAuthLoading: false,
  }),
}));

vi.mock('@features/users/components/DataConfirmation', () => ({
  DataConfirmation: ({
    formData,
    updateForm,
  }: {
    formData: LostPetReportData;
    updateForm?: (d: Partial<LostPetReportData>) => void;
  }) => (
    <div data-testid="data-confirmation">
      {updateForm && (
        <button onClick={() => updateForm({ name: 'Nuevo nombre' })}>
          Editar nombre
        </button>
      )}
      <span>{formData?.name}</span>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

let mockLostPetReportData: LostPetReportData | null = null;
let updatePetReportData: React.Dispatch<
  React.SetStateAction<LostPetReportData | null>
> | null = null;
const mockSetLostPetReportData = vi.fn((data: LostPetReportData | null) => {
  updatePetReportData?.(data);
});

vi.mock('@shared/context/PetReportContext', () => ({
  usePetReport: () => {
    const [lostPetReportData, setLostPetReportData] = React.useState(
      mockLostPetReportData,
    );

    updatePetReportData = setLostPetReportData;

    return {
      lostPetReportData,
      setLostPetReportData: mockSetLostPetReportData,
    };
  },
}));

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

// @ts-ignore
const MOCK_REPORT_DATA: LostPetReportData = {
  name: 'Firulais',
  species: 'Perro',
  date: '2023-10-25',
  breed: 'Labrador',
  sex: 'Macho',
  color: 'Café',
  size: 'Mediana: 11 a 25 kg',
  description: 'Perro amigable',
  images: [],
  imageLayout: '1',
  address: 'Calle 123, Querétaro',
  location: null,
  locationCoords: undefined,
  contactName: 'Juan Pérez',
  phoneNumber: '+52 442 123 4567',
  email: 'juan@example.com',
  planName: 'Básico',
};

describe('ReportConfirmationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    posterExportMocks.exportPosterAsFile.mockResolvedValue(
      new File(['poster'], 'Firulais-poster.png', { type: 'image/png' }),
    );
    mockLostPetReportData = null;
    updatePetReportData = null;
  });

  test('redirects to "/" when lostPetReportData is null (direct URL access)', () => {
    mockLostPetReportData = null;
    renderWithRouter(<ReportConfirmationPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('renders nothing (null) when lostPetReportData is null before redirect', () => {
    mockLostPetReportData = null;
    const { container } = renderWithRouter(<ReportConfirmationPage />);
    expect(container.firstChild).toBeNull();
  });

  test('renders the page title when lostPetReportData is available', () => {
    mockLostPetReportData = MOCK_REPORT_DATA;
    renderWithRouter(<ReportConfirmationPage />);
    expect(screen.getByText('Confirmación de datos')).toBeDefined();
  });

  test('renders DataConfirmation component with the report data', () => {
    mockLostPetReportData = MOCK_REPORT_DATA;
    renderWithRouter(<ReportConfirmationPage />);

    expect(screen.getByTestId('data-confirmation')).toBeDefined();
    expect(screen.getByText('Firulais')).toBeDefined();
  });

  test('renders the "Continuar" button', () => {
    mockLostPetReportData = MOCK_REPORT_DATA;
    renderWithRouter(<ReportConfirmationPage />);
    expect(screen.getByText('Continuar')).toBeDefined();
  });

  test('does not redirect when lostPetReportData is available', () => {
    mockLostPetReportData = MOCK_REPORT_DATA;
    renderWithRouter(<ReportConfirmationPage />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('navigates to /plans when "Continuar" is clicked', async () => {
    const user = userEvent.setup();
    mockLostPetReportData = MOCK_REPORT_DATA;
    renderWithRouter(<ReportConfirmationPage />);

    await user.click(screen.getByText('Continuar'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/plans');
    });
  });

  test('calls setLostPetReportData with merged data when handleUpdateForm is triggered', async () => {
    const user = userEvent.setup();
    mockLostPetReportData = MOCK_REPORT_DATA;

    renderWithRouter(<ReportConfirmationPage />);
    await user.click(screen.getByText('Editar nombre'));

    expect(mockSetLostPetReportData).toHaveBeenCalledWith({
      ...MOCK_REPORT_DATA,
      name: 'Nuevo nombre',
    });
  });
});
