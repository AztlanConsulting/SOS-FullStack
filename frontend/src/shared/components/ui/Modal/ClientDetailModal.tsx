import { Modal } from '@/shared/components/ui/Modal/Modal';
import { ConfirmationModal } from '@/shared/components/ui/Modal/ConfirmationModal';
import type { PlanStatus } from '@/features/clients/types/client.type';
import { useState, useEffect } from 'react';
import { Text } from '@/shared/components/ui/Text';
import { stripEmojis } from '@/shared/utils/stripEmojis';
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
  client: ClientListItem;
  petId?: string;
  onClose: () => void;
  onUpdate: (updateConversation: string) => void;
  onRefresh?: () => void;
}

type PendingDetailUpdate =
  | { type: 'conversation'; value: string }
  | { type: 'notes'; value: string };

export const ClientDetailModal = ({
  client,
  onClose,
  onUpdate,
  onRefresh,
  petId,
}: Props) => {
  const {
    client: detail,
    loading,
    error,
    refetch,
  } = useClientDetail(client._id);
  const [editingConversation, setEditingConversation] = useState(false);
  const [conversationValue, setConversationValue] = useState('');
  const [planStatuses, setPlanStatuses] = useState<Record<string, PlanStatus>>(
    {},
  );
  const [pendingDetailUpdate, setPendingDetailUpdate] =
    useState<PendingDetailUpdate | null>(null);
  const [isUpdatingDetail, setIsUpdatingDetail] = useState(false);
  const [detailUpdateError, setDetailUpdateError] = useState<string | null>(
    null,
  );
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    planId: string;
    planName: string;
    petName: string;
    previousStatus: PlanStatus | '';
    status: PlanStatus;
  } | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null,
  );
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');

  const petsToShow = petId
    ? detail?.pets?.filter((p) => p._id === petId)
    : detail?.pets;

  useEffect(() => {
    if (detail) {
      setConversationValue(detail.conversation ?? '');
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

  useEffect(() => {
    if (detail?.notes !== undefined) {
      setNotesValue(detail.notes);
    }
  }, [detail]);

  const statusLabels: Record<PlanStatus, string> = {
    continua: 'Continua',
    'casi expira': 'Casi expira',
    expirado: 'Expirado',
    RIP: 'RIP',
    encontrado: 'Encontrado',
  };

  const getStatusLabel = (status: PlanStatus | '') =>
    status ? statusLabels[status] : '---';

  const irreversibleSourceStatuses: Array<PlanStatus | ''> = [
    '',
    'continua',
    'casi expira',
    'expirado',
  ];
  const finalStatuses: PlanStatus[] = ['RIP', 'encontrado'];

  const isIrreversibleStatusChange = () => {
    if (!pendingStatusChange) return false;
    return (
      irreversibleSourceStatuses.includes(pendingStatusChange.previousStatus) &&
      finalStatuses.includes(pendingStatusChange.status)
    );
  };

  const getStatusChangeDescription = () => {
    if (!pendingStatusChange) return '';
    const base = `¿Está segura de marcar el plan ${pendingStatusChange.planName} de ${pendingStatusChange.petName} como ${statusLabels[pendingStatusChange.status]}?`;
    if (
      irreversibleSourceStatuses.includes(pendingStatusChange.previousStatus)
    ) {
      return `${base} Toma en cuenta que, una vez guardado, no se podrá regresar al estado ${getStatusLabel(pendingStatusChange.previousStatus).toLowerCase()}.`;
    }
    return base;
  };

  const confirmDetailUpdate = async () => {
    if (!pendingDetailUpdate) return;
    setIsUpdatingDetail(true);
    setDetailUpdateError(null);
    try {
      if (pendingDetailUpdate.type === 'conversation') {
        await ClientService.updateConversation(
          client._id,
          pendingDetailUpdate.value,
        );
        setEditingConversation(false);
        onUpdate(pendingDetailUpdate.value);
      } else {
        await ClientService.updateClient(client._id, {
          notes: pendingDetailUpdate.value,
        });
        setEditingNotes(false);
        onUpdate(detail?.conversation ?? '');
      }
      setPendingDetailUpdate(null);
      onRefresh?.();
      refetch();
    } catch {
      setDetailUpdateError('No se pudo guardar el cambio.');
    } finally {
      setIsUpdatingDetail(false);
    }
  };

  const confirmPlanStatusChange = async () => {
    if (!pendingStatusChange) return;
    setIsUpdatingStatus(true);
    setStatusUpdateError(null);
    try {
      await ClientService.updatePlanStatus(
        pendingStatusChange.planId,
        pendingStatusChange.status,
      );
      setPlanStatuses((prev) => ({
        ...prev,
        [pendingStatusChange.planId]: pendingStatusChange.status,
      }));
      setPendingStatusChange(null);
      onRefresh?.();
      refetch();
    } catch {
      setStatusUpdateError('No se pudo actualizar el estatus del plan.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
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
                <Text
                  variant="small"
                  color="text-gray-600"
                  className="truncate"
                >
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
                  <div className="flex flex-col gap-1 flex-1 w-full">
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                      <input
                        type="url"
                        value={conversationValue}
                        onChange={(e) =>
                          setConversationValue(stripEmojis(e.target.value))
                        }
                        maxLength={100}
                        placeholder="https://..."
                        className="text-xs border border-gray-300 rounded px-2 py-1 min-w-0 flex-1 outline-none focus:border-yellow-400"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            let value = conversationValue.trim();
                            if (value && !value.startsWith('http')) {
                              value = `https://${value}`;
                              setConversationValue(value);
                            }
                            setDetailUpdateError(null);
                            setPendingDetailUpdate({
                              type: 'conversation',
                              value,
                            });
                          }}
                          disabled={isUpdatingDetail}
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
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {conversationValue &&
                      conversationValue.startsWith('http') ? (
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
                        Color:{' '}
                        <span className="text-gray-700">{pet.color}</span>
                      </Text>
                    )}
                    {pet.size && (
                      <Text variant="small" color="text-gray-500">
                        Tamaño:{' '}
                        <span className="text-gray-700">{pet.size}</span>
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
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-1">
                              {index === 0 && (
                                <select
                                  value={planStatuses[plan._id] ?? ''}
                                  disabled={isUpdatingStatus}
                                  onChange={(e) => {
                                    if (!e.target.value) return;
                                    const newStatus = e.target
                                      .value as PlanStatus;
                                    setStatusUpdateError(null);
                                    setPendingStatusChange({
                                      planId: plan._id,
                                      planName: plan.name,
                                      petName: pet.name,
                                      previousStatus:
                                        planStatuses[plan._id] ?? '',
                                      status: newStatus,
                                    });
                                  }}
                                  className="text-xs border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-yellow-400"
                                >
                                  <option value="">Seleccionar</option>
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

            <div className="flex flex-col gap-2">
              <Text variant="small" weight="medium" color="text-gray-500">
                Notas
              </Text>
              {editingNotes ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={notesValue}
                    onChange={(e) => setNotesValue(stripEmojis(e.target.value))}
                    maxLength={200}
                    rows={3}
                    className="text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-yellow-400 resize-none w-full"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDetailUpdateError(null);
                          setPendingDetailUpdate({
                            type: 'notes',
                            value: notesValue,
                          });
                        }}
                        disabled={isUpdatingDetail}
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
                    <Text
                      variant="small"
                      as="span"
                      weight="medium"
                      className="text-emerald-700"
                    >
                      Quedan {200 - notesValue.length} caracteres
                    </Text>
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
      {pendingDetailUpdate && (
        <ConfirmationModal
          title="Confirmar edición"
          description={
            pendingDetailUpdate.type === 'conversation'
              ? `¿Está segura de guardar el nuevo link de conversación de ${client.username}?`
              : `¿Está segura de guardar los cambios en las notas de ${client.username}?`
          }
          confirmLabel="Sí, guardar"
          isLoading={isUpdatingDetail}
          errorMessage={detailUpdateError}
          onCancel={() => {
            if (!isUpdatingDetail) {
              setPendingDetailUpdate(null);
              setDetailUpdateError(null);
            }
          }}
          onConfirm={confirmDetailUpdate}
        />
      )}
      {pendingStatusChange && (
        <ConfirmationModal
          title="Confirmar cambio"
          description={getStatusChangeDescription()}
          confirmLabel="Sí, actualizar"
          tone={isIrreversibleStatusChange() ? 'danger' : 'warning'}
          isLoading={isUpdatingStatus}
          errorMessage={statusUpdateError}
          onCancel={() => {
            if (!isUpdatingStatus) {
              setPendingStatusChange(null);
              setStatusUpdateError(null);
            }
          }}
          onConfirm={confirmPlanStatusChange}
        />
      )}
    </>
  );
};
