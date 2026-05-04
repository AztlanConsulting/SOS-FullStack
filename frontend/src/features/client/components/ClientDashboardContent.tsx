import { useDashboardMetrics } from '@/features/graphs/hooks/useDashboardMetrics';
import { CountdownChart } from '@/features/graphs/components/CountDownChart';
import { Text } from '@/shared/components/ui/Text/Text';
import { PurchasedResourceCard } from './PurchasedResourceCard';

const ClientDashboardContent = () => {
  const { metrics, loading, error } = useDashboardMetrics();

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Text variant="h3" color="text-gray-400">
          Cargando la información...
        </Text>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Text variant="h3" color="text-red-500">
          {error || 'No se encontraron datos'}
        </Text>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 flex flex-col gap-5">
          <Text variant="h2" weight="bold" className="text-gray-900">
            Progreso de tu plan
          </Text>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
            {metrics.planProgress ? (
              <CountdownChart data={metrics.planProgress} />
            ) : (
              <div className="py-10 text-center">
                <Text variant="body" color="text-gray-500">
                  No tienes un plan activo en este momento.
                </Text>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-5">
          <Text variant="h2" weight="bold" className="text-gray-900">
            Tus recursos
          </Text>

          {metrics.resources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {metrics.resources.map((resource) => (
                <PurchasedResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full flex flex-col items-center justify-center">
              <Text variant="body" color="text-gray-500">
                Aún no tienes recursos comprados.
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardContent;
