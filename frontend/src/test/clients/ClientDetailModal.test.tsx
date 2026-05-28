import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { ClientDetailModal } from '@/shared/components/ui/Modal/ClientDetailModal';
import { ClientService } from '@/features/clients/services/client.service';
import type {
  ClientDetail,
  ClientListItem,
} from '@/features/clients/types/client.type';

const { refetchMock } = vi.hoisted(() => ({
  refetchMock: vi.fn(),
}));

const detailMock: ClientDetail = {
  _id: 'client-1',
  username: 'Mauricio',
  email: 'mauricio@test.com',
  phone: '1234567890',
  conversation: 'https://sos.com',
  createdAt: '2026-05-28T00:00:00.000Z',
  notes: '',
  plans: [],
  pets: [
    {
      _id: 'pet-1',
      name: 'Bingo',
      species: 'Perro',
      plans: [
        {
          _id: 'plan-1',
          name: 'Plan Básico',
          status: 'continua',
          duration: 7,
          radius: 3,
          createdAt: '2026-05-28T00:00:00.000Z',
        },
      ],
    },
  ],
};

const clientMock: ClientListItem = {
  _id: 'client-1',
  username: 'Mauricio',
  email: 'mauricio@test.com',
  phone: '1234567890',
  conversation: 'https://sos.com',
  createdAt: '2026-05-28T00:00:00.000Z',
  pet: {
    _id: 'pet-1',
    name: 'Bingo',
    species: 'Perro',
  },
  plan: {
    _id: 'plan-1',
    name: 'Plan Básico',
    status: 'continua',
  },
};

vi.mock('@/features/clients/hooks/useClientDetail', () => ({
  useClientDetail: () => ({
    client: detailMock,
    loading: false,
    error: null,
    refetch: refetchMock,
  }),
}));

vi.mock('@/features/clients/services/client.service', () => ({
  ClientService: {
    getClientById: vi.fn(),
    updateConversation: vi.fn(),
    updateClient: vi.fn(),
    updatePlanStatus: vi.fn(),
  },
}));

describe('ClientDetailModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ClientService.updateConversation).mockResolvedValue(undefined);
    vi.mocked(ClientService.updateClient).mockResolvedValue(undefined);
    vi.mocked(ClientService.updatePlanStatus).mockResolvedValue(undefined);
  });

  test('confirms before updating the conversation link', async () => {
    const onRefresh = vi.fn();
    const onUpdate = vi.fn();

    render(
      <ClientDetailModal
        client={clientMock}
        petId="pet-1"
        onClose={vi.fn()}
        onUpdate={onUpdate}
        onRefresh={onRefresh}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[0]);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'https://wa.me/nuevo' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(ClientService.updateConversation).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toHaveTextContent(
      '¿Está segura de guardar el nuevo link de conversación de Mauricio?',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sí, guardar' }));

    await waitFor(() => {
      expect(ClientService.updateConversation).toHaveBeenCalledWith(
        'client-1',
        'https://wa.me/nuevo',
      );
    });
    expect(onUpdate).toHaveBeenCalledWith('https://wa.me/nuevo');
    expect(onRefresh).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });

  test('confirms before updating notes', async () => {
    const onRefresh = vi.fn();

    render(
      <ClientDetailModal
        client={clientMock}
        petId="pet-1"
        onClose={vi.fn()}
        onUpdate={vi.fn()}
        onRefresh={onRefresh}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Editar' })[1]);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Llamar por la tarde' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(ClientService.updateClient).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toHaveTextContent(
      '¿Está segura de guardar los cambios en las notas de Mauricio?',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sí, guardar' }));

    await waitFor(() => {
      expect(ClientService.updateClient).toHaveBeenCalledWith('client-1', {
        notes: 'Llamar por la tarde',
      });
    });
    expect(onRefresh).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });

  test('confirms before updating plan status', async () => {
    const onRefresh = vi.fn();

    render(
      <ClientDetailModal
        client={clientMock}
        petId="pet-1"
        onClose={vi.fn()}
        onUpdate={vi.fn()}
        onRefresh={onRefresh}
      />,
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'RIP' },
    });

    expect(ClientService.updatePlanStatus).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toHaveTextContent(
      '¿Está segura de marcar el plan Plan Básico de Bingo como RIP?',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sí, actualizar' }));

    await waitFor(() => {
      expect(ClientService.updatePlanStatus).toHaveBeenCalledWith(
        'plan-1',
        'RIP',
      );
    });
    expect(onRefresh).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });
});
