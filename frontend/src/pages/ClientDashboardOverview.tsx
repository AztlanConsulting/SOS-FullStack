import PlanProgressSection from '@/features/client/components/PlanProgressSection';
import { AdProgressSection } from '@/features/client/components/AdProgressSection';
import { useDashboardMetrics } from '@/features/graphs/hooks/useDashboardMetrics';
import { useNavigate } from 'react-router';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button';

const ClientDashboardOverview = () => {
  const { metrics, loading, error } = useDashboardMetrics();
  const navigate = useNavigate();

  const petData = metrics?.planProgress;
  const formattedDate = petData?.dateMissing
    ? new Date(petData.dateMissing).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const posterUrl = petData?.posterImage
    ? petData.posterImage.startsWith('http')
      ? petData.posterImage
      : `${baseUrl}${petData.posterImage}`
    : null;

  const handleResourcesPage = () => {
    navigate('/portal-exclusivo');
  };

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
    <main className="w-full pb-10">
      <div className="flex flex-col gap-10">
        <section className="w-full bg-light-purple border-b border-gray-200 pt-28 lg:pt-10">
          <div className="w-full px-4 md:px-6 lg:max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto py-8 flex flex-col gap-4 items-center">
            <Text variant="h2" weight="medium" as="div">
              Portal exclusivo
            </Text>

            {petData && (
              <div className="flex items-center gap-4 mt-10">
                <div className="w-30 h-30 md:w-35 md:h-35 rounded-full overflow-hidden border-[3px] border-purple-primary shrink-0 shadow-sm">
                  <img
                    src={petData.petImage || 'pet.jpg'}
                    alt={petData.petName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <Text variant="h3" weight="medium" as="div">
                    {petData.petName}
                  </Text>
                  <Text
                    variant="caption"
                    color="text-gray-600"
                    className="mt-1"
                  >
                    Desde {formattedDate}, <br /> esperando que vuelva a casa
                  </Text>
                </div>
              </div>
            )}

            <div className="flex justify-center md:justify-start">
              <Button
                label="Visita nuestro contenido exclusivo"
                variant="primary"
                textColor="bg-purple-primary text-white hover:bg-[#866CA0] rounded-full w-fit px-6 py-2 text-sm whitespace-nowrap mx-auto md:ml-0 md:mr-auto"
                onClick={handleResourcesPage}
              />
            </div>
          </div>
        </section>

        <div className="w-full px-4 md:px-6 lg:max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-6">
              <PlanProgressSection petData={metrics.planProgress} />
            </div>
            <div className="lg:col-span-6">
              <div className="flex flex-col gap-5 h-full">
                <AdProgressSection posterUrl={posterUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientDashboardOverview;
