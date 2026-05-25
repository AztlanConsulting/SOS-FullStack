import { Modal } from '@/shared/components/ui/Modal/Modal';
import type { PlanStatus } from '@/features/clients/types/client.type';
import { useState, useEffect } from 'react';
import { Text } from '@/shared/components/ui/Text';
import {
  HiMail,
  HiPhone,
  HiLink,
  HiPencil,
  HiCalendar,
  HiCreditCard,
} from 'react-icons/hi';
import { useClientDetail } from '@/features/clients/hooks/useClientDetail';
import type { ClientListItem } from '@/features/clients/types/client.type';
import { ClientService } from '@/features/clients/services/client.service';
import { calculateStackedExpiry } from '@/shared/utils/planDates';

interface Props {
  /** Summary data of the client from the list view. */
  client: ClientListItem;
  /** Optional pet ID to directly open the modal focused on a specific pet's details. */
  petId?: string;
  /** Function to close the modal. */
  onClose: () => void;
  /** Callback to notify the parent component that the conversation link has been updated. */
  onUpdate: (updateConversation: string) => void;
  /** Callback to notify parent to refresh the clients list. */
  onRefresh?: () => void;
}

/**
 *
 * Displays a comprehensive view of a client's profile, including:
 * - Contact information.
 * - Editable "Conversation" link.
 * - Pet information (Species, Breed, missing location, etc.).
 * - Active plan details and current status.
 * - Editable notes section for internal use.
 */
export const ClientDetailModal = ({
  client,
  onClose,
  onUpdate,
  onRefresh,
  petId,
}: Props) => {
  // Fetch full details (pets, plans, etc.) using the custom hook
  const { client: detail, loading, error } = useClientDetail(client._id);
  // State for the inline editing flow of the conversation link
  const [editingConversation, setEditingConversation] = useState(false);
  const [conversationValue, setConversationValue] = useState(
    detail?.conversation ?? '',
  );
  const [planStatuses, setPlanStatuses] = useState<Record<string, PlanStatus>>(
    {},
  );
  const petsToShow = petId
    ? detail?.pets?.filter((p) => p._id === petId)
    : detail?.pets;

  // Sync internal input state when data is loaded from the hook
  useEffect(() => {
    if (detail?.conversation) {
      setConversationValue(detail.conversation);
    }
  }, [detail]);

  useEffect(() => {
    if (detail?.pets) {
      const statuses: Record<string, PlanStatus> = {};
      detail.pets.forEach((pet) => {
        pet.plans?.forEach((p) => {
          statuses[p._id] = p.status;
        });
      });
      setPlanStatuses(statuses);
    }
  }, [detail]);

  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');

  useEffect(() => {
    if (detail?.notes !== undefined) {
      setNotesValue(detail.notes);
    }
  }, [detail]);

  return (
    <Modal title={client.username} onClose={onClose}>
      {loading && (
        <Text
          variant="caption"
          color="text-gray-400"
          className="text-center py-4"
        >
          Cargando...
        </Text>
      )}

      {error && (
        <Text
          variant="caption"
          color="text-red-500"
          className="text-center py-4"
        >
          {error}
        </Text>
      )}

      {detail && (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)] modal-scrollbar pr-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <HiMail size={14} className="text-gray-400 shrink-0" />
              <Text variant="small" color="text-gray-600" className="truncate">
                {detail.email}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <HiPhone size={14} className="text-gray-400 shrink-0" />
              <Text variant="small" color="text-gray-600">
                {detail.phone}
              </Text>
            </div>
            {detail.fbUser && (
              <div className="flex items-center gap-2">
                <Text variant="small" color="text-gray-400">
                  FB:
                </Text>
                <Text variant="small" color="text-gray-600">
                  {detail.fbUser}
                </Text>
              </div>
            )}
            <div className="flex items-center gap-2">
              <HiCalendar size={14} className="text-gray-400 shrink-0" />
              <Text variant="small" color="text-gray-600">
                {detail.createdAt
                  ? new Date(detail.createdAt).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : '—'}
              </Text>
            </div>
            {detail.paymentMethod && (
              <div className="flex items-center gap-2">
                <HiCreditCard size={14} className="text-gray-400 shrink-0" />
                <Text variant="small" color="text-gray-600">
                  {detail.paymentMethod}
                </Text>
              </div>
            )}
            <div className="flex items-center gap-2 flex-1 col-span-2">
              <HiLink size={14} className="text-gray-400 shrink-0" />
              {editingConversation ? (
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  <input
                    type="url"
                    value={conversationValue}
                    onChange={(e) => setConversationValue(e.target.value)}
                    maxLength={100}
                    placeholder="https://..."
                    className="text-xs border border-gray-300 rounded px-2 py-1 min-w-0 flex-1 outline-none focus:border-yellow-400"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await ClientService.updateConversation(
                          client._id,
                          conversationValue,
                        );
                        setEditingConversation(false);
                        onUpdate(conversationValue);
                      }}
                      className="text-xs text-primary font-medium hover:text-yellow-600 whitespace-nowrap"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setConversationValue(detail?.conversation ?? '');
                        setEditingConversation(false);
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {conversationValue && conversationValue.startsWith('http') ? (
                    <a
                      href={conversationValue}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 text-xs hover:underline truncate min-w-0 flex-1 block"
                    >
                      {conversationValue}
                    </a>
                  ) : (
                    <Text
                      variant="small"
                      color="text-gray-500"
                      className="flex-1 truncate"
                    >
                      {conversationValue || '—'}
                    </Text>
                  )}
                  <button
                    onClick={() => setEditingConversation(true)}
                    className="group flex items-center gap-1 border border-gray-300 rounded-full px-2 py-0.5 hover:bg-[#F9CD48]/25 hover:border hover:border-[#C2991D] transition-colors"
                  >
                    <HiPencil
                      size={11}
                      className="text-gray-400 group-hover:text-[#C2991D]"
                    />
                    <span className="text-xs text-gray-400 group-hover:text-[#C2991D]">
                      Editar
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Pet info */}
          {petsToShow?.map((pet, petIndex) => {
            const expiryDates = pet.plans
              ? calculateStackedExpiry(
                  pet.plans.filter(
                    (
                      p,
                    ): p is typeof p & {
                      createdAt: string;
                      duration: number;
                    } => Boolean(p.createdAt && p.duration),
                  ),
                )
              : [];

            return (
              <div key={pet._id} className="flex flex-col gap-2">
                {petIndex > 0 && <div className="h-px bg-gray-200" />}
                <div className="flex items-center gap-2">
                  <Text variant="caption" weight="semibold">
                    {pet.name}
                  </Text>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {pet.species}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {pet.breed && (
                    <Text variant="small" color="text-gray-500">
                      Raza: <span className="text-gray-700">{pet.breed}</span>
                    </Text>
                  )}
                  {pet.color && (
                    <Text variant="small" color="text-gray-500">
                      Color: <span className="text-gray-700">{pet.color}</span>
                    </Text>
                  )}
                  {pet.size && (
                    <Text variant="small" color="text-gray-500">
                      Tamaño: <span className="text-gray-700">{pet.size}</span>
                    </Text>
                  )}
                  {pet.sex && (
                    <Text variant="small" color="text-gray-500">
                      Sexo: <span className="text-gray-700">{pet.sex}</span>
                    </Text>
                  )}
                  {pet.location?.properties && (
                    <Text
                      variant="small"
                      color="text-gray-500"
                      className="col-span-2"
                    >
                      Lugar:{' '}
                      <span className="text-gray-700">
                        {[
                          pet.location.properties.city,
                          pet.location.properties.state,
                          pet.location.properties.country,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </Text>
                  )}
                </div>
                {pet.description && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <Text
                      variant="small"
                      color="text-gray-400"
                      className="mb-1"
                    >
                      Características
                    </Text>
                    <Text
                      variant="small"
                      color="text-gray-600"
                      className="leading-relaxed"
                    >
                      {pet.description}
                    </Text>
                  </div>
                )}
                {pet.plans && pet.plans.length > 0 && (
                  <div className="flex flex-col gap-3 mt-1">
                    {pet.plans.map((plan, index) => (
                      <div key={plan._id} className="flex flex-col gap-1">
                        {index > 0 && <div className="h-px bg-gray-100" />}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 items-center">
                          <Text variant="small" color="text-gray-500">
                            Plan:{' '}
                            <span className="text-gray-700">{plan.name}</span>
                          </Text>
                          {plan.duration && (
                            <Text variant="small" color="text-gray-500">
                              Duración:{' '}
                              <span className="text-gray-700">
                                {plan.duration} días
                              </span>
                            </Text>
                          )}
                          {plan.radius && (
                            <Text variant="small" color="text-gray-500">
                              Radio:{' '}
                              <span className="text-gray-700">
                                {plan.radius} km
                              </span>
                            </Text>
                          )}
                          {plan.createdAt && (
                            <Text variant="small" color="text-gray-500">
                              Fecha de inicio:{' '}
                              <span className="text-gray-700">
                                {new Date(plan.createdAt).toLocaleDateString(
                                  'es-MX',
                                  {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  },
                                )}
                              </span>
                            </Text>
                          )}
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <select
                                value={planStatuses[plan._id] ?? ''}
                                onChange={async (e) => {
                                  if (!e.target.value) return;
                                  const newStatus = e.target
                                    .value as PlanStatus;
                                  setPlanStatuses((prev) => ({
                                    ...prev,
                                    [plan._id]: newStatus,
                                  }));
                                  await ClientService.updatePlanStatus(
                                    plan._id,
                                    newStatus,
                                  );
                                  onRefresh?.();
                                }}
                                className="text-xs border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-yellow-400"
                              >
                                <option value="">—</option>
                                <option value="RIP">RIP</option>
                                <option value="encontrado">Encontrado</option>
                              </select>
                            )}
                          </div>
                          {expiryDates[index] && (
                            <Text variant="small" color="text-gray-500">
                              Fecha final:{' '}
                              <span
                                className={`font-medium ${expiryDates[index] < new Date() ? 'text-red-500' : 'text-gray-700'}`}
                              >
                                {expiryDates[index] < new Date()
                                  ? `Expirado el ${expiryDates[index].toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                                  : expiryDates[index].toLocaleDateString(
                                      'es-MX',
                                      {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                      },
                                    )}
                              </span>
                            </Text>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="h-px bg-gray-100" />

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <Text variant="small" weight="medium" color="text-gray-500">
              Notas
            </Text>
            {editingNotes ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-yellow-400 resize-none w-full"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={async () => {
                      await ClientService.updateClient(client._id, {
                        notes: notesValue,
                      });
                      setEditingNotes(false);
                      onUpdate(detail?.conversation ?? '');
                    }}
                    className="group flex items-center gap-1 border border-gray-300 rounded-full px-2 py-0.5 hover:bg-[#F9CD48]/25 hover:border hover:border-[#C2991D] transition-colors"
                  >
                    <span className="text-xs text-gray-400 group-hover:text-[#C2991D]">
                      Guardar
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setNotesValue(detail?.notes ?? '');
                      setEditingNotes(false);
                    }}
                    className="group flex items-center gap-1 border border-gray-300 rounded-full px-2 py-0.5 hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <span className="text-xs text-gray-400 group-hover:text-red-400">
                      Cancelar
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <Text
                  variant="small"
                  color="text-gray-600"
                  className="flex-1 break-all"
                >
                  {notesValue || 'Sin notas'}
                </Text>
                <button
                  onClick={() => setEditingNotes(true)}
                  className="group flex items-center gap-1 border border-gray-300 rounded-full px-2 py-0.5 hover:bg-[#F9CD48]/25 hover:border hover:border-[#C2991D] transition-colors"
                >
                  <HiPencil
                    size={11}
                    className="text-gray-400 group-hover:text-[#C2991D]"
                  />
                  <span className="text-xs text-gray-400 group-hover:text-[#C2991D]">
                    Editar
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
