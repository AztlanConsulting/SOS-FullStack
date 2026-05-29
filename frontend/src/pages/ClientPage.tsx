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
import { usePlanDistribution } from '@/features/graphs/hooks/usePlanDistribution';
import { ActivePlanChart } from '@/features/graphs/components/ActivePlanChart';
import { useVisitMetrics } from '@/features/graphs/hooks/useVisitMetrics';
import { VisitsLineChart } from '@/features/graphs/components/VisitsLineChart';
import { useClientsByCountry } from '@/features/graphs/hooks/useClientsByCountry';
import { CountryDistributionChart } from '@/features/graphs/components/CountryDistributionChart';

/**
 *
 * The main administration view for managing clients. It provides:
 * - A data table with server-side pagination.
 * - Global search and advanced filtering by plan status.
 * - CSV export functionality for reporting.
 * - Detailed view of specific clients via a modal interface.
 */
export const ClientsPage = () => {
  const { distribution, loading: loadingMetrics } = usePlanDistribution();
  const { data: countryData, loading: loadingCountries } =
    useClientsByCountry();
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(
    undefined,
  );
  const { visits, loading: loadingVisits } = useVisitMetrics(
    currentDate.year,
    currentDate.month,
  );
  const prevMonth = () =>
    setCurrentDate((d) => {
      if (d.month === 1) return { year: d.year - 1, month: 12 };
      return { ...d, month: d.month - 1 };
    });

  const nextMonth = () =>
    setCurrentDate((d) => {
      if (d.month === 12) return { year: d.year + 1, month: 1 };
      return { ...d, month: d.month + 1 };
    });

  // State to track which client is currently being viewed in the detail modal
  const [selectedClient, setSelectedClient] = useState<ClientListItem | null>(
    null,
  );
  // State to track export errors and loading
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
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
    exportClients,
  } = useClients();

  return (
    <div className="flex min-h-screen bg-[#F6F6F6] overflow-x-hidden w-full">
      <Sidebar />

      <div className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 flex flex-col gap-6 min-w-0 overflow-x-hidden lg:ml-64">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 flex">
            <div className="bg-[#FFE598]/20 rounded-xl border border-primary p-5 flex-1 h-[320px] lg:h-[350px] overflow-hidden">
              <Text variant="h3" weight="regular" className="mb-4">
                Planes activos
              </Text>
              {loadingMetrics ? (
                <div className="flex items-center justify-center h-52">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <ActivePlanChart data={distribution} />
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-[#FFE598]/20 rounded-xl border border-primary p-5 flex-1 h-[320px] lg:h-[350px] overflow-hidden">
              <Text variant="h3" weight="regular" className="mb-4">
                Visitas
              </Text>
              {loadingVisits ? (
                <div className="flex items-center justify-center h-52">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <VisitsLineChart
                  data={visits}
                  year={currentDate.year}
                  month={currentDate.month}
                  onPrev={prevMonth}
                  onNext={nextMonth}
                />
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#FFE598]/20 rounded-xl border border-primary p-5">
          <Text variant="h3" weight="regular" className="mb-4">
            Distribución por país
          </Text>
          {loadingCountries ? (
            <div className="flex items-center justify-center h-52">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <CountryDistributionChart data={countryData} />
          )}
        </div>
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
                disabled={isExporting}
                onClick={async () => {
                  if (clients.length === 0) {
                    setExportError('No hay clientes para exportar');
                    setTimeout(() => setExportError(null), 3000);
                    return;
                  }
                  setIsExporting(true);
                  setExportError(null);

                  try {
                    const all = await exportClients();
                    if (!all.length) {
                      setExportError('No hay clientes para exportar');
                      setTimeout(() => setExportError(null), 3000);
                      return;
                    }
                    exportToCSV(
                      'clientes',
                      all.map((c: ClientListItem) => ({
                        Nombre: c.username,
                        Email: c.email,
                        Teléfono: c.phone,
                        Mascota: c.pet?.name ?? '-',
                        Plan: c.plan?.name ?? '-',
                        Estatus: c.plan?.status ?? '-',
                        Conversación: c.conversation ?? '-',
                      })),
                    );
                  } catch (err) {
                    setExportError('Error al exportar clientes');
                    setTimeout(() => setExportError(null), 3000);
                  } finally {
                    setIsExporting(false);
                  }
                }}
              />
              {exportError && (
                <Text variant="caption" color="text-red-500">
                  {exportError}
                </Text>
              )}
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
            onRowClick={(client) => {
              setSelectedClient(client);
              setSelectedPetId(client.pet?._id);
            }}
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
              petId={selectedPetId}
              onClose={() => {
                setSelectedClient(null);
                setSelectedPetId(undefined);
              }}
              onUpdate={fetchClients}
              onRefresh={fetchClients}
            />
          )}
        </div>
      </div>
    </div>
  );
};
