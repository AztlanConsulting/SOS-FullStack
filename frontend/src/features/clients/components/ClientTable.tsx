import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text';
import { PlanStatusBadge } from '@/shared/components/ui/StatusBadge/PlanStatus';
import type { ClientListItem } from '../types/client.type';

const HEADERS = [
  'Nombre',
  'ID Plan',
  'Nombre mascota',
  'Notas',
  'Link de la conversacion',
  'Estatus del plan',
];

interface Props {
  clients: ClientListItem[];
  loading: boolean;
}

export const ClientTable = ({ clients, loading }: Props) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="hidden md:block overflow-x-auto rounded-lg border border-[#AFB1B6]">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-primary">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left border-b border-[#AFB1B6]"
                >
                  <div className="flex items-center gap-1">
                    <Text variant="caption" weight="medium" color="text-white">
                      {h}
                    </Text>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <Text variant="caption" color="text-gray-400">
                    Cargando...
                  </Text>
                </td>
              </tr>
            )}
            {!loading && clients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <Text variant="caption" color="text-gray-400">
                    No se encontraron clientes.
                  </Text>
                </td>
              </tr>
            )}
            {!loading &&
              clients.map((client) => (
                <tr
                  key={client._id}
                  onClick={() => navigate(`/clients/${client._id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <Text variant="caption">{client.username}</Text>
                  </td>
                  <td className="px-4 py-3">
                    <Text variant="caption">
                      {client.plan?._id.slice(-4) ?? '—'}
                    </Text>
                  </td>
                  <td className="px-4 py-3">
                    <Text variant="caption">{client.pet?.name ?? '—'}</Text>
                  </td>
                  <td className="px-4 py-3">
                    <Text variant="caption">
                      {client.pet?.description ?? '—'}
                    </Text>
                  </td>
                  <td className="px-4 py-3">
                    {client.conversation ? (
                      <a
                        href={client.conversation}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 text-xs hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {client.conversation}
                      </a>
                    ) : (
                      <Text variant="caption" color="text-gray-400">
                        —
                      </Text>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {client.plan?.status ? (
                      <PlanStatusBadge status={client.plan.status} />
                    ) : (
                      <Text variant="caption" color="text-gray-400">
                        —
                      </Text>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-3">
        {loading && (
          <Text
            variant="caption"
            color="text-gray-400"
            className="text-center py-6"
          >
            Cargando...
          </Text>
        )}
        {!loading && clients.length === 0 && (
          <Text
            variant="caption"
            color="text-gray-400"
            className="text-center py-6"
          >
            No se encontraron clientes.
          </Text>
        )}
        {!loading &&
          clients.map((client) => (
            <div
              key={client._id}
              onClick={() => navigate(`/clients/${client._id}`)}
              className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Text variant="caption" weight="semibold">
                  {client.username}
                </Text>
              </div>
              <div className="flex flex-col gap-1">
                <Text variant="small" color="text-gray-500">
                  Mascota: {client.pet?.name ?? '—'}
                </Text>
                <Text variant="small" color="text-gray-500">
                  ID Plan: {client.plan?._id.slice(-4) ?? '—'}
                </Text>
                <Text variant="small" color="text-gray-500">
                  Notas: {client.pet?.description ?? '—'}
                </Text>
                {client.conversation && (
                  <a
                    href={client.conversation}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 text-xs hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {client.conversation}
                  </a>
                )}
                {client.plan?.status ? (
                  <PlanStatusBadge status={client.plan.status} />
                ) : (
                  <Text variant="small" color="text-gray-400">
                    —
                  </Text>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
