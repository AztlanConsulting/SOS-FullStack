import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
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
    createdAt: new Date('2024-01-15').toISOString(),
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
    createdAt: new Date('2024-02-20').toISOString(),
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
    expect(screen.queryAllByText('Nombre del cliente').length).toBeGreaterThan(
      0,
    );
    expect(screen.queryAllByText('Fecha de compra').length).toBeGreaterThan(0);
    expect(
      screen.queryAllByText('Nombre de la mascota').length,
    ).toBeGreaterThan(0);
    expect(screen.queryAllByText('Características').length).toBeGreaterThan(0);
    expect(
      screen.queryAllByText('Link de la conversación').length,
    ).toBeGreaterThan(0);
    expect(screen.queryAllByText('Estatus del plan').length).toBeGreaterThan(0);
  });

  /**
   * Verifies table renders client rows correctly
   */
  test('renders client rows with correct data', () => {
    renderTable();
    expect(screen.queryAllByText('Sebastian').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Pookie').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('ojos grandes').length).toBeGreaterThan(0);
  });

  /**
   * Verifies loading state shows spinner animation
   */
  test('shows loading animation when loading is true', () => {
    const { container } = renderTable([], true);
    expect(container.querySelector('.animate-spin')).toBeTruthy();
  });

  /**
   * Verifies empty state message when no clients
   */
  test('shows empty message when no clients', () => {
    renderTable([]);
    expect(
      screen.queryAllByText('No se encontraron clientes.').length,
    ).toBeGreaterThan(0);
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
