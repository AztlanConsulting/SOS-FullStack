import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ClientTable } from '@/features/clients/components/ClientTable';
import type {
  ClientListItem,
  PlanStatus,
} from '@/features/clients/types/client.type';

const mockClients: ClientListItem[] = [
  {
    _id: '1',
    username: 'Sebastian',
    email: 'sebastian@test.com',
    phone: '1234567890',
    conversation: 'https://sos.com',
    pet: {
      _id: 'p1',
      name: 'Pookie',
      species: 'dog',
      description: 'ojos grandes',
    },
    plan: { _id: 'pl1', name: 'Plan Básico', status: 'continua' as PlanStatus },
  },
  {
    _id: '2',
    username: 'Jorge',
    email: 'jorge@test.com',
    phone: '0987654321',
    pet: {
      _id: 'p2',
      name: 'Mamba',
      species: 'dog',
      description: 'collar rosa',
    },
    plan: {
      _id: 'pl2',
      name: 'Plan Estándar',
      status: 'expirado' as PlanStatus,
    },
  },
];

const renderTable = (
  clients = mockClients,
  loading = false,
  onRowClick = vi.fn(),
) => {
  return render(
    <MemoryRouter>
      <ClientTable
        clients={clients}
        loading={loading}
        onRowClick={onRowClick}
      />
    </MemoryRouter>,
  );
};

describe('ClientTable (Component Tests)', () => {
  /**
   * Verifies table renders all headers correctly
   */
  test('renders all column headers', () => {
    renderTable();
    expect(screen.getAllByText('Nombre')).toBeDefined();
    expect(screen.getAllByText('ID Plan')).toBeDefined();
    expect(screen.getAllByText('Nombre mascota')).toBeDefined();
    expect(screen.getAllByText('Notas')).toBeDefined();
    expect(screen.getAllByText('Link de la conversacion')).toBeDefined();
    expect(screen.getAllByText('Estatus del plan')).toBeDefined();
  });

  /**
   * Verifies table renders client rows correctly
   */
  test('renders client rows with correct data', () => {
    renderTable();
    expect(screen.getAllByText('Sebastian')).toBeDefined();
    expect(screen.getAllByText('Pookie')).toBeDefined();
    expect(screen.getAllByText('ojos grandes')).toBeDefined();
  });

  /**
   * Verifies loading state shows cargando message
   */
  test('shows loading message when loading is true', () => {
    renderTable([], true);
    expect(screen.getAllByText('Cargando...')).toBeDefined();
  });

  /**
   * Verifies empty state message when no clients
   */
  test('shows empty message when no clients', () => {
    renderTable([]);
    expect(screen.getAllByText('No se encontraron clientes.')).toBeDefined();
  });

  /**
   * Verifies onRowClick is called when row is clicked
   */
  test('calls onRowClick when row is clicked', () => {
    const onRowClick = vi.fn();
    renderTable(mockClients, false, onRowClick);
    fireEvent.click(screen.getAllByText('Sebastian')[0]);
    expect(onRowClick).toHaveBeenCalledWith(mockClients[0]);
  });

  /**
   * Verifies plan status badge is rendered
   */
  test('renders plan status badge', () => {
    renderTable();
    expect(screen.getAllByText('Continua').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Expirado').length).toBeGreaterThan(0);
  });

  /**
   * Verifies dash is shown for missing conversation
   */
  test('shows dash when conversation is missing', () => {
    renderTable([mockClients[1]]);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });
});
