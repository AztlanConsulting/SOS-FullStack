import { HiDownload, HiPencil, HiFilter } from 'react-icons/hi';
import { Text } from '@/shared/components/ui/Text';
import { ClientTable } from '@/features/clients/components/ClientTable';
import { useClients } from '@/features/clients/hooks/useClients';
import { Button } from '@/shared/components/ui/Button/Button';
import { ClientSearch } from '@/features/clients/components/ClientSearch';

export const ClientsPage = () => {
  const {
    clients,
    loading,
    error,
    page,
    totalPages,
    setPage,
    search,
    setSearch,
  } = useClients();

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-6">
      <div className="bg-[#FFE598]/20 rounded-xl border border-primary p-5">
        <Text variant="h3" weight="regular" className="mb-4">
          Lista de clientes
        </Text>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Button variant="toolbar" label="Exportar" icon={HiDownload} />
            <Button variant="toolbar" label="" icon={HiPencil} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="toolbar" label="" icon={HiFilter} />
            <ClientSearch value={search} onChange={setSearch} />
          </div>
        </div>
        {error && (
          <Text variant="caption" color="text-red-500" className="mb-2">
            {error}
          </Text>
        )}
        <ClientTable clients={clients} loading={loading} />
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              ←
            </button>
            <Text variant="caption" color="text-gray-500">
              {page} / {totalPages}
            </Text>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
