import PlanProgressSection from '@/features/client/components/PlanProgressSection';
import { AdProgressSection } from '@/features/client/components/AdProgressSection';
import { useDashboardMetrics } from '@/features/graphs/hooks/useDashboardMetrics';
import { useNavigate } from 'react-router';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button';

const dashboardContainerClass =
  'w-full px-4 md:px-6 lg:max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto';

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

const trimTrailingSlashes = (url: string) => url.replace(/\/+$/, '');

const resolveMediaUrl = (url?: string | null) => {
  const mediaUrl = url?.trim();

  if (!mediaUrl) {
    return null;
  }

  if (/^https?:\/\//i.test(mediaUrl)) {
    return mediaUrl;
  }

  const baseUrl = trimTrailingSlashes(
    import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  );
  const path = mediaUrl.startsWith('/') ? mediaUrl : `/${mediaUrl}`;

  return `${baseUrl}${path}`;
};

const formatDateMissing = (dateMissing?: string | null) => {
  if (!dateMissing) {
    return '';
  }

  const date = new Date(dateMissing);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const ClientDashboardOverview = () => {
  const { metrics, loading, error } = useDashboardMetrics();
  const navigate = useNavigate();

  const petData = metrics?.planProgress;
  const lostLocation = petData?.location?.trim();
  const formattedDate = formatDateMissing(petData?.dateMissing);
  const petImageUrl = resolveMediaUrl(petData?.petImage) || 'pet.jpg';
  const posterUrl = resolveMediaUrl(petData?.posterImage);

  const handleResourcesPage = () => {
    navigate('/portal-exclusivo');
  };

  const handlePetCollection = () => {
    navigate('/inicio/coleccion-mascotas');
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
    <main className="w-full pt-20 pb-10 lg:pt-0">
      <div className="flex flex-col gap-10">
        <div className="w-full border-b border-gray-200">
          <section className="w-full bg-dark-purple">
            <div
              className={`${dashboardContainerClass} flex h-14 items-center justify-center md:h-16 lg:h-14`}
            >
              <Text
                variant="h2"
                weight="medium"
                as="div"
                color="text-white"
                className="leading-none"
              >
                Portal exclusivo
              </Text>
            </div>
          </section>

          {petData && (
            <section className="w-full bg-light-purple">
              <div className={`${dashboardContainerClass} py-8 lg:py-10`}>
                <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10">
                  <div className="w-40 h-40 md:w-50 md:h-50 rounded-full overflow-hidden border-[3px] border-purple-primary shrink-0 shadow-sm">
                    <img
                      src={petImageUrl}
                      alt={petData.petName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex w-full max-w-md flex-col items-center gap-2 text-center md:items-start md:text-left">
                    <Text variant="h3" weight="medium" as="div">
                      {petData.petName}
                    </Text>
                    <Text variant="body" color="text-gray-600" className="mt-1">
                      Desde {formattedDate}, <br /> se perdió en{' '}
                      {lostLocation || 'ubicación no disponible'}.
                    </Text>
                    <div className="mt-2 flex w-full max-w-xs flex-col gap-3 md:max-w-md lg:max-w-xl lg:flex-row lg:gap-4 lg:text-nowrap">
                      <Button
                        label="Visita nuestro contenido exclusivo"
                        variant="primary"
                        textColor="bg-purple-primary text-white hover:bg-dark-purple"
                        onClick={handleResourcesPage}
                      />
                      <Button
                        label="Galería de mascotas"
                        variant="primary"
                        textColor="bg-white text-black hover:bg-dark-purple hover:text-white"
                        onClick={handlePetCollection}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className={dashboardContainerClass}>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <PlanProgressSection petData={metrics.planProgress} />
            </div>
            <div className="lg:col-span-6">
              <AdProgressSection posterUrl={posterUrl} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientDashboardOverview;
