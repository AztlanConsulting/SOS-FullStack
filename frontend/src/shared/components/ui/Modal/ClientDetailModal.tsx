import { Modal } from '@/shared/components/ui/Modal/Modal';
import { ConfirmationModal } from '@/shared/components/ui/Modal/ConfirmationModal';
import type { PlanStatus } from '@/features/clients/types/client.type';
import { useState, useEffect, useRef } from 'react';
import { Text } from '@/shared/components/ui/Text';
import { stripEmojis } from '@/shared/utils/stripEmojis';
import {
  HiMail,
  HiPhone,
  HiLink,
  HiPencil,
  HiCalendar,
  HiCreditCard,
  HiPhotograph,
  HiX,
} from 'react-icons/hi';
import { useClientDetail } from '@/features/clients/hooks/useClientDetail';
import type { ClientListItem } from '@/features/clients/types/client.type';
import { ClientService } from '@/features/clients/services/client.service';
import { ResourceService } from '@/features/resources/services/resourceItem.service';
import LoadingSpinner from '../LoadingSpinner';
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
  | { type: 'notes'; petId: string; value: string }
  | {
    type: 'publicNote';
    petId: string;
    value: { text: string; image: string };
  };

// Per-pet editing state
interface PetNoteState {
  editingNotes: boolean;
  notesValue: string;
  editingPublicNote: boolean;
  publicNoteText: string;
  publicNoteImage: string;
  publicNoteImageFile: File | null;
  publicNoteImagePreview: string;
  isUploadingImage: boolean;
}

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

  // Per-pet note states keyed by petId
  const [petNoteStates, setPetNoteStates] = useState<
    Record<string, PetNoteState>
  >({});
  const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  // Initialize per-pet note states from detail
  useEffect(() => {
    if (detail?.pets) {
      setPetNoteStates((prev) => {
        const next = { ...prev };
        detail.pets.forEach((pet) => {
          if (!next[pet._id]) {
            next[pet._id] = {
              editingNotes: false,
              notesValue: pet.notes ?? '',
              editingPublicNote: false,
              publicNoteText: pet.publicNote?.text ?? '',
              publicNoteImage: pet.publicNote?.image ?? '',
              publicNoteImageFile: null,
              publicNoteImagePreview: pet.publicNote?.image ?? '',
              isUploadingImage: false,
            };
          } else {
            // Update values from server without resetting editing state
            next[pet._id] = {
              ...next[pet._id],
              notesValue: pet.notes ?? '',
              publicNoteText: pet.publicNote?.text ?? '',
              publicNoteImage: pet.publicNote?.image ?? '',
              publicNoteImagePreview:
                next[pet._id].publicNoteImagePreview ||
                (pet.publicNote?.image ?? ''),
            };
          }
        });
        return next;
      });
    }
  }, [detail]);

  const updatePetState = (pid: string, patch: Partial<PetNoteState>) => {
    setPetNoteStates((prev) => ({
      ...prev,
      [pid]: { ...prev[pid], ...patch },
    }));
  };

  const handlePublicNoteImageChange = (
    pid: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setDetailUpdateError('La imagen no puede pesar más de 2 MB.');
      return;
    }
    updatePetState(pid, {
      publicNoteImageFile: file,
      publicNoteImagePreview: URL.createObjectURL(file),
    });
  };

  const handleRemovePublicNoteImage = (pid: string) => {
    updatePetState(pid, {
      publicNoteImageFile: null,
      publicNoteImagePreview: '',
      publicNoteImage: '',
    });
    const ref = imageInputRefs.current[pid];
    if (ref) ref.value = '';
  };

  const handleCancelPublicNote = (
    pid: string,
    pet: (typeof detail.pets)[0],
  ) => {
    updatePetState(pid, {
      publicNoteText: pet.publicNote?.text ?? '',
      publicNoteImage: pet.publicNote?.image ?? '',
      publicNoteImagePreview: pet.publicNote?.image ?? '',
      publicNoteImageFile: null,
      editingPublicNote: false,
    });
    const ref = imageInputRefs.current[pid];
    if (ref) ref.value = '';
  };

  const handleSavePublicNote = async (pid: string) => {
    setDetailUpdateError(null);
    const state = petNoteStates[pid];
    if (!state) return;

    let imageUrl = state.publicNoteImage;

    if (state.publicNoteImageFile) {
      updatePetState(pid, { isUploadingImage: true });
      try {
        imageUrl = await ResourceService.uploadImage(state.publicNoteImageFile);
      } catch {
        setDetailUpdateError('No se pudo subir la imagen.');
        updatePetState(pid, { isUploadingImage: false });
        return;
      }
      updatePetState(pid, { isUploadingImage: false });
    }

    setPendingDetailUpdate({
      type: 'publicNote',
      petId: pid,
      value: { text: state.publicNoteText, image: imageUrl },
    });
  };

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
      } else if (pendingDetailUpdate.type === 'notes') {
        await ClientService.updatePetNotes(pendingDetailUpdate.petId, {
          notes: pendingDetailUpdate.value,
        });
        updatePetState(pendingDetailUpdate.petId, { editingNotes: false });
        onUpdate(detail?.conversation ?? '');
      } else if (pendingDetailUpdate.type === 'publicNote') {
        await ClientService.updatePetNotes(pendingDetailUpdate.petId, {
          publicNote: pendingDetailUpdate.value,
        });
        updatePetState(pendingDetailUpdate.petId, {
          publicNoteImage: pendingDetailUpdate.value.image,
          publicNoteImagePreview: pendingDetailUpdate.value.image,
          publicNoteImageFile: null,
          editingPublicNote: false,
        });
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

  const getConfirmationDescription = () => {
    if (!pendingDetailUpdate) return '';
    if (pendingDetailUpdate.type === 'conversation') {
      return `¿Está segura de guardar el nuevo link de conversación de ${client.username}?`;
    }
    if (pendingDetailUpdate.type === 'publicNote') {
      return `¿Está segura de guardar la nota pública de ${client.username}?`;
    }
    return `¿Está segura de guardar los cambios en las notas de ${client.username}?`;
  };

  return (
    <>
      <Modal title={client.username} onClose={onClose}>
        {loading && (
          <div className="min-h-64 flex items-center justify-center">
            <LoadingSpinner />
          </div>
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

              const ps = petNoteStates[pet._id];

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
                                <Text variant="small" color="text-gray-500">
                                  Estatus del plan:
                                </Text>
                              )}
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

                  {ps && (
                    <>
                      <div className="h-px bg-gray-100" />

                      {/* Nota pública */}
                      <div className="flex flex-col gap-2">
                        <Text
                          variant="small"
                          weight="medium"
                          color="text-red-500"
                        >
                          Nota pública
                        </Text>
                        {ps.editingPublicNote ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={ps.publicNoteText}
                              onChange={(e) =>
                                updatePetState(pet._id, {
                                  publicNoteText: stripEmojis(e.target.value),
                                })
                              }
                              maxLength={600}
                              rows={3}
                              placeholder="Escribe una nota visible para el cliente..."
                              className="text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-yellow-400 resize-none w-full"
                              autoFocus
                            />
                            <Text
                              variant="small"
                              as="span"
                              weight="medium"
                              className="text-emerald-700 self-end"
                            >
                              Quedan {600 - ps.publicNoteText.length} caracteres
                            </Text>

                            {/* Image picker */}
                            <div className="flex flex-col gap-1">
                              {ps.publicNoteImagePreview ? (
                                <div className="relative w-fit">
                                  <img
                                    src={ps.publicNoteImagePreview}
                                    alt="Vista previa"
                                    className="h-24 w-auto rounded-md border border-gray-200 object-cover"
                                  />
                                  <button
                                    onClick={() =>
                                      handleRemovePublicNoteImage(pet._id)
                                    }
                                    className="absolute -top-1.5 -right-1.5 bg-white border border-gray-300 rounded-full p-0.5 hover:bg-red-50 hover:border-red-300 transition-colors"
                                  >
                                    <HiX
                                      size={11}
                                      className="text-gray-400 hover:text-red-400"
                                    />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    imageInputRefs.current[pet._id]?.click()
                                  }
                                  className="group flex items-center gap-1.5 self-start border border-dashed border-gray-300 rounded-md px-3 py-1.5 hover:border-[#C2991D] hover:bg-[#F9CD48]/10 transition-colors"
                                >
                                  <HiPhotograph
                                    size={13}
                                    className="text-gray-400 group-hover:text-[#C2991D]"
                                  />
                                  <span className="text-xs text-gray-400 group-hover:text-[#C2991D]">
                                    Agregar imagen
                                  </span>
                                </button>
                              )}
                              <input
                                ref={(el) => {
                                  imageInputRefs.current[pet._id] = el;
                                }}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handlePublicNoteImageChange(pet._id, e)
                                }
                              />
                            </div>

                            {detailUpdateError && (
                              <Text variant="small" color="text-red-500">
                                {detailUpdateError}
                              </Text>
                            )}

                            <div className="flex gap-2.5 self-end">
                              <button
                                onClick={() => handleSavePublicNote(pet._id)}
                                disabled={
                                  isUpdatingDetail || ps.isUploadingImage
                                }
                                className="group flex items-center gap-1 border border-gray-300 rounded-full px-2 py-0.5 hover:bg-[#F9CD48]/25 hover:border hover:border-[#C2991D] transition-colors disabled:opacity-50"
                              >
                                <span className="text-xs text-gray-400 group-hover:text-[#C2991D]">
                                  {ps.isUploadingImage
                                    ? 'Subiendo...'
                                    : 'Guardar'}
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleCancelPublicNote(pet._id, pet)
                                }
                                disabled={ps.isUploadingImage}
                                className="group flex items-center gap-1 border border-gray-300 rounded-full px-2 py-0.5 hover:bg-red-50 hover:border-red-300 transition-colors"
                              >
                                <span className="text-xs text-gray-400 group-hover:text-red-400">
                                  Cancelar
                                </span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <Text
                                variant="small"
                                color="text-gray-600"
                                className="flex-1 break-all"
                              >
                                {ps.publicNoteText || 'Sin nota pública'}
                              </Text>
                              <button
                                onClick={() =>
                                  updatePetState(pet._id, {
                                    editingPublicNote: true,
                                  })
                                }
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
                            {ps.publicNoteImagePreview && (
                              <img
                                src={ps.publicNoteImagePreview}
                                alt="Nota pública"
                                className="w-full rounded-md border border-gray-200 object-contain"
                              />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-gray-100" />

                      {/* Notas internas */}
                      <div className="flex flex-col gap-2">
                        <Text
                          variant="small"
                          weight="medium"
                          color="text-gray-500"
                        >
                          Notas
                        </Text>
                        {ps.editingNotes ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              value={ps.notesValue}
                              onChange={(e) =>
                                updatePetState(pet._id, {
                                  notesValue: stripEmojis(e.target.value),
                                })
                              }
                              maxLength={600}
                              rows={3}
                              className="text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-yellow-400 resize-none w-full"
                              autoFocus
                            />
                            <div className="flex flex-col gap-2 items-end">
                              <Text
                                variant="small"
                                as="span"
                                weight="medium"
                                className="text-emerald-700"
                              >
                                Quedan {600 - ps.notesValue.length} caracteres
                              </Text>
                              <div className="flex gap-2.5">
                                <button
                                  onClick={() => {
                                    setDetailUpdateError(null);
                                    setPendingDetailUpdate({
                                      type: 'notes',
                                      petId: pet._id,
                                      value: ps.notesValue,
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
                                  onClick={() =>
                                    updatePetState(pet._id, {
                                      notesValue: pet.notes ?? '',
                                      editingNotes: false,
                                    })
                                  }
                                  className="group flex items-center gap-1 border border-gray-300 rounded-full px-2 py-0.5 hover:bg-red-50 hover:border-red-300 transition-colors"
                                >
                                  <span className="text-xs text-gray-400 group-hover:text-red-400">
                                    Cancelar
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <Text
                              variant="small"
                              color="text-gray-600"
                              className="flex-1 break-all"
                            >
                              {ps.notesValue || 'Sin notas'}
                            </Text>
                            <button
                              onClick={() =>
                                updatePetState(pet._id, { editingNotes: true })
                              }
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
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Modal>
      {pendingDetailUpdate && (
        <ConfirmationModal
          title="Confirmar edición"
          description={getConfirmationDescription()}
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
