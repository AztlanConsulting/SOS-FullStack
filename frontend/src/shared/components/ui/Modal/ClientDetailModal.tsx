import { Modal } from '@/shared/components/ui/Modal/Modal';
import { useState, useEffect } from 'react';
import { Text } from '@/shared/components/ui/Text';
import { PlanStatusBadge } from '@/shared/components/ui/StatusBadge/PlanStatus';
import { HiMail, HiPhone, HiLink, HiPencil } from 'react-icons/hi';
import { useClientDetail } from '@/features/clients/hooks/useClientDetail';
import type { ClientListItem } from '@/features/clients/types/client.type';
import { ClientService } from '@/features/clients/services/client.service';

interface Props {
  client: ClientListItem;
  onClose: () => void;
  onUpdate: (updateConversation: string) => void;
}

export const ClientDetailModal = ({ client, onClose, onUpdate }: Props) => {
  const { client: detail, loading, error } = useClientDetail(client._id);
  const [editingConversation, setEditingConversation] = useState(false);
  const [conversationValue, setConversationValue] = useState(
    detail?.conversation ?? '',
  );

  useEffect(() => {
    if (detail?.conversation) {
      setConversationValue(detail.conversation);
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
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <HiMail size={14} className="text-gray-400 shrink-0" />
              <Text variant="small" color="text-gray-600">
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
              <HiLink size={14} className="text-gray-400 shrink-0" />
              {editingConversation ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={conversationValue}
                    onChange={(e) => setConversationValue(e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 flex-1 outline-none focus:border-yellow-400"
                    autoFocus
                  />
                  <button
                    onClick={async () => {
                      await ClientService.updateConversation(
                        client._id,
                        conversationValue,
                      );
                      setEditingConversation(false);
                      onUpdate(conversationValue);
                    }}
                    className="text-xs text-primary font-medium hover:text-yellow-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setConversationValue(detail?.conversation ?? '');
                      setEditingConversation(false);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <a
                    href={conversationValue}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 text-xs hover:underline truncate"
                  >
                    {conversationValue || '—'}
                  </a>
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
          {detail.pets?.[0] && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Text variant="caption" weight="semibold">
                  {detail.pets[0].name}
                </Text>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {detail.pets[0].species}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {detail.pets[0].breed && (
                  <Text variant="small" color="text-gray-500">
                    Raza:{' '}
                    <span className="text-gray-700">
                      {detail.pets[0].breed}
                    </span>
                  </Text>
                )}
                {detail.pets[0].color && (
                  <Text variant="small" color="text-gray-500">
                    Color:{' '}
                    <span className="text-gray-700">
                      {detail.pets[0].color}
                    </span>
                  </Text>
                )}
                {detail.pets[0].size && (
                  <Text variant="small" color="text-gray-500">
                    Tamaño:{' '}
                    <span className="text-gray-700">{detail.pets[0].size}</span>
                  </Text>
                )}
                {detail.pets[0].sex && (
                  <Text variant="small" color="text-gray-500">
                    Sexo:{' '}
                    <span className="text-gray-700">{detail.pets[0].sex}</span>
                  </Text>
                )}
                {detail.pets[0].placeMissing && (
                  <Text
                    variant="small"
                    color="text-gray-500"
                    className="col-span-2"
                  >
                    Lugar:{' '}
                    <span className="text-gray-700">
                      {detail.pets[0].placeMissing}
                    </span>
                  </Text>
                )}
              </div>
              {detail.pets[0].description && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <Text variant="small" color="text-gray-400" className="mb-1">
                    Características
                  </Text>
                  <Text
                    variant="small"
                    color="text-gray-600"
                    className="leading-relaxed"
                  >
                    {detail.pets[0].description}
                  </Text>
                </div>
              )}
            </div>
          )}

          <div className="h-px bg-gray-100" />

          {/* Plan info */}
          {detail.plans?.[0] && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 items-center">
              <Text variant="small" color="text-gray-500">
                Plan:{' '}
                <span className="text-gray-700">{detail.plans[0].name}</span>
              </Text>

              {detail.plans[0].duration && (
                <Text variant="small" color="text-gray-500">
                  Duración:{' '}
                  <span className="text-gray-700">
                    {detail.plans[0].duration} días
                  </span>
                </Text>
              )}
              {detail.plans[0].radius && (
                <Text variant="small" color="text-gray-500">
                  Radio:{' '}
                  <span className="text-gray-700">
                    {detail.plans[0].radius} km
                  </span>
                </Text>
              )}
              <div className="flex justify-end">
                <PlanStatusBadge status={detail.plans[0].status} />
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
