import { HiDownload } from 'react-icons/hi';
import { Text } from '@/shared/components/ui/Text';
import { ClientTable } from '@/features/clients/components/ClientTable';
import { useClients } from '@/features/clients/hooks/useClients';
import { Button } from '@/shared/components/ui/Button/Button';
import { ClientSearch } from '@/features/clients/components/ClientSearch';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { useState } from 'react';
import type { ClientListItem } from '@/features/clients/types/client.type';
import { ClientDetailModal } from '@/shared/components/ui/Modal/ClientDetailModal';
import { exportToCSV } from '@/shared/utils/exportCSV';
import { FilterDropdown } from '@/features/clients/components/FilterDropdown';

/**
 *
 * The main administration view for managing clients. It provides:
 * - A data table with server-side pagination.
 * - Global search and advanced filtering by plan status.
 * - CSV export functionality for reporting.
 * - Detailed view of specific clients via a modal interface.
 */
export const ClientsPage = () => {
  // State to track which client is currently being viewed in the detail modal
  const [selectedClient, setSelectedClient] = useState<ClientListItem | null>(
    null,
  );
  // Custom hook managing the fetch logic, pagination state, and filter parameters
  const {
    clients,
    loading,
    error,
    page,
    totalPages,
    setPage,
    search,
    setSearch,
    fetchClients,
    filters,
    setFilters,
  } = useClients();

  return (
    <div className="flex min-h-screen bg-[#F6F6F6]">
      <Sidebar />
      <div className="flex-1 p-6 pb-24 md:pb-6">
        <div className="bg-[#FFE598]/20 rounded-xl border border-primary p-5">
          <Text variant="h3" weight="regular" className="mb-4">
            Lista de clientes
          </Text>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Button
                variant="toolbar"
                label="Exportar"
                icon={HiDownload}
                onClick={() =>
                  exportToCSV(
                    'clientes',
                    clients.map((c) => ({
                      Nombre: c.username,
                      Email: c.email,
                      Teléfono: c.phone,
                      Mascota: c.pet?.name ?? '-',
                      Plan: c.plan?.name ?? '-',
                      Estatus: c.plan?.status ?? '-',
                      Conversación: c.conversation ?? '-',
                    })),
                  )
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <FilterDropdown filters={filters} onChange={setFilters} />
              <ClientSearch value={search} onChange={setSearch} />
            </div>
          </div>
          {error && (
            <Text variant="caption" color="text-red-500" className="mb-2">
              {error}
            </Text>
          )}
          <ClientTable
            clients={clients}
            loading={loading}
            onRowClick={(client) => setSelectedClient(client)}
          />
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
          {selectedClient && (
            <ClientDetailModal
              client={selectedClient}
              onClose={() => setSelectedClient(null)}
              onUpdate={fetchClients}
            />
          )}
        </div>
      </div>
    </div>
  );
};
