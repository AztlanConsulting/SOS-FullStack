import PlanProgressSection from '@/features/client/components/PlanProgressSection';
import { PurchasedResourcesSection } from '@/features/client/components/PurchasedResourcesSection';
import { useDashboardMetrics } from '@/features/graphs/hooks/useDashboardMetrics';
import { Text } from '@/shared/components/ui/Text/Text';

const ClientDashboardOverview = () => {
  const { metrics, loading, error } = useDashboardMetrics();

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
        </div>
      )}
    </main>
  );
};

export default ClientDashboardOverview;
