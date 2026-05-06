import PlanProgressSection from '@/features/client/components/PlanProgressSection';
import { PurchasedResourcesSection } from '@/features/client/components/PurchasedResourcesSection';
import { useDashboardMetrics } from '@/features/graphs/hooks/useDashboardMetrics';
import { DashboardPoster } from '@/features/client/components/DashboradPoster';
import { useActivePetReport } from '@/features/users/hooks/useDashboradPosterData';
import { Text } from '@/shared/components/ui/Text/Text';

const ClientDashboardOverview = () => {
  const { metrics, loading, error } = useDashboardMetrics();
  const {
    petData: posterData,
    isLoading: isPosterLoading,
    error: posterError,
  } = useActivePetReport();

  const petData = metrics?.planProgress;
  const formattedDate = petData?.dateMissing
    ? new Date(petData.dateMissing).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  return (
    <main className="w-full px-4 md:px-6 lg:max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto pt-28 lg:pt-10 pb-10">
      {loading ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Text variant="h3" color="text-gray-400">
            Cargando la información...
          </Text>
        </div>
      ) : error || !metrics ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Text variant="h3" color="text-red-500">
            {error || 'No se encontraron datos'}
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {petData && (
            <div className="flex items-center gap-4 border-b border-gray-200 pb-6 w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-[3px] border-purple-primary shrink-0 shadow-sm">
                <img
                  src={petData.petImage || 'pet.jpg'}
                  alt={petData.petName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <Text variant="h3" weight="medium">
                  {petData.petName}
                </Text>
                <Text variant="caption" color="text-gray-500" className="mt-1">
                  Desde {formattedDate},<br className="sm:hidden" /> esperando
                  que vuelva a casa
                </Text>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <PlanProgressSection petData={metrics.planProgress} />
            </div>
            <div className="lg:col-span-8">
              <PurchasedResourcesSection resources={metrics.resources} />
            </div>
          </div>
          <div className="mt-2">
            <Text variant="h3" weight="medium" className="mb-6">
              Póster de Búsqueda
            </Text>

            {isPosterLoading ? (
              <div className="flex flex-col items-center justify-center w-full h-[400px] bg-gray-50 rounded-xl animate-pulse border border-dashed border-gray-300">
                <Text variant="body" color="text-gray-500" weight="medium">
                  Armando tu póster...
                </Text>
              </div>
            ) : posterError ? (
              <div className="flex flex-col items-center justify-center w-full h-[200px] bg-red-50 rounded-xl border border-red-200">
                <Text variant="body" color="text-red-700">
                  Hubo un problema al cargar tu póster.
                </Text>
              </div>
            ) : posterData ? (
              <div className="flex justify-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <DashboardPoster petData={posterData} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-[200px] bg-yellow-50 rounded-xl border border-yellow-200">
                <Text variant="body" color="text-yellow-700">
                  Aún no tienes un reporte de mascota perdido activo para
                  generar el póster.
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ClientDashboardOverview;
