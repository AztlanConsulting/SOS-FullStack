import PlanProgressSection from '@/features/client/components/PlanProgressSection';
import { AdProgressSection } from '@/features/client/components/AdProgressSection';
import { useDashboardMetrics } from '@/features/graphs/hooks/useDashboardMetrics';
import { useNavigate } from 'react-router';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button';
import { useState } from 'react';
import encontrado from '@assets/images/Encontrado.webp';
import rip from '@assets/images/Rip.webp';
import portal from '@assets/images/Portal.webp';

const dashboardContainerClass =
  'w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto';

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
  const { metrics, clientNotes, loading, error } = useDashboardMetrics();
  const navigate = useNavigate();
  const [openPetIndex, setOpenPetIndex] = useState<number | null>(null);

  const petsData = metrics?.planProgress;

  const handleResourcesPage = () => {
    navigate('/inicio/contenido-exclusivo');
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const handlePetCollection = () => {
    navigate('/inicio/radar-de-coincidencias');
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
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
    <main className="w-full pt-20 lg:pt-0">
      <div className="flex flex-col gap-10">
        <div className="w-full border-b border-gray-200 bg-light-purple min-h-[80vh]">
          <section className="w-full bg-purple-primary mb-5">
            <div
              className={`${dashboardContainerClass} py-8 flex flex-col items-center justify-center`}
            >
              <Text
                variant="h2"
                weight="medium"
                as="div"
                color="text-white"
                className="leading-none mb-8"
              >
                Portal exclusivo
              </Text>
              <img
                loading="lazy"
                src={portal}
                alt="Portal exclusivo"
                className="w-full"
              />
              <Text
                variant="body"
                weight="medium"
                as="div"
                className="my-3 w-full text-white"
              >
                Nota del asesor
              </Text>
              <div className="mt-1 rounded-lg bg-white p-4 shadow-sm border border-gray-100 w-full flex items-evenly gap-6">
                {clientNotes?.image && (
                  <img
                    src={clientNotes.image}
                    alt="Nota del asesor"
                    className="w-1/4 h-auto"
                  />
                )}
                <Text variant="body" color="text-gray-600" as="div">
                  {clientNotes?.text ||
                    'No hay nota disponible por el momento.'}
                </Text>
              </div>
            </div>
          </section>
          <div className="py-5">
            {petsData &&
              petsData.map((petData, index) => {
                const petImageUrl = resolveMediaUrl(petData.petImage) || '';
                const posterUrl = resolveMediaUrl(petData.posterImage) || '';
                const formattedDate = formatDateMissing(petData.dateMissing);
                const lostLocation = petData.location;
                const isOpen = openPetIndex === index;

                return (
                  <section
                    key={`${petData.petName}-${petData.dateMissing ?? index}`}
                    className="w-full"
                  >
                    <div className={`${dashboardContainerClass} pb-5`}>
                      <button
                        type="button"
                        onClick={() => setOpenPetIndex(isOpen ? null : index)}
                        className={`flex w-full items-center justify-between gap-4 rounded-lg border border-purple-primary/20 bg-white px-4 py-4 text-left shadow-lg transition hover:border-purple-primary/70 hover:shadow-md ${isOpen ? 'border border-purple-primary/40 shadow-md' : ''}`}
                      >
                        <div className="flex min-w-0 items-center gap-6">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-purple-primary">
                            <img
                              src={petImageUrl}
                              alt={petData.petName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Text
                              variant="h3"
                              weight="medium"
                              as="div"
                              className="truncate"
                            >
                              {petData.petName}
                            </Text>
                            <Text
                              variant="body"
                              color="text-gray-600"
                              className="truncate"
                            >
                              {formattedDate
                                ? `Desde ${formattedDate}`
                                : 'Información disponible'}
                            </Text>
                          </div>
                        </div>

                        <Text
                          variant="body"
                          color="text-gray-600"
                          className="shrink-0"
                        >
                          {isOpen ? 'Ocultar' : 'Ver detalles'}
                        </Text>
                      </button>

                      {isOpen && (
                        <div className="bg-white p-5 lg:p-10 rounded-b-lg">
                          <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10 p-5 bg-purple-secondary rounded-lg shadow-sm">
                            <div className="w-50 h-50 rounded-full overflow-hidden border-[3px] border-purple-primary shrink-0 shadow-sm">
                              <img
                                loading="lazy"
                                src={petImageUrl}
                                alt={petData.petName}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex w-full lg:w-9/13 flex-col items-center gap-5 text-center md:items-start md:text-left">
                              <Text variant="h3" weight="medium" as="div">
                                {petData.petName}
                              </Text>
                              <Text
                                variant="body"
                                color="text-gray-600"
                                className="mt-1"
                              >
                                Desde {formattedDate}, <br /> se perdió en{' '}
                                {lostLocation || 'ubicación no disponible'}.
                              </Text>
                              <div className="mt-2 flex w-full flex-col gap-3 md:max-w-md lg:max-w-xl lg:flex-row lg:gap-4 lg:text-nowrap">
                                <Button
                                  label="Visita nuestro contenido exclusivo"
                                  variant="primary"
                                  textColor="bg-purple-primary text-white hover:bg-dark-purple"
                                  onClick={handleResourcesPage}
                                />
                                <Button
                                  label="Radar de coincidencias"
                                  variant="primary"
                                  textColor="bg-white text-[var(--color-purple-primary)] hover:bg-dark-purple hover:text-white border-2 border-[var(--color-purple-primary)]"
                                  onClick={handlePetCollection}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-5">
                            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:items-stretch">
                              <div className="lg:col-span-6 lg:h-full">
                                {petData.planStatus === 'RIP' && (
                                  <div className="flex h-full flex-col gap-5">
                                    <Text
                                      variant="h3"
                                      weight="medium"
                                      className="text-center w-full"
                                    >
                                      Progreso del plan
                                    </Text>
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 py-5 px-5 lg:px-15 flex flex-1 flex-col items-center justify-center">
                                      <img loading="lazy" src={rip} alt="RIP" />
                                    </div>
                                  </div>
                                )}
                                {petData.planStatus === 'encontrado' && (
                                  <div className="flex h-full flex-col gap-5">
                                    <Text
                                      variant="h3"
                                      weight="medium"
                                      className="text-center w-full"
                                    >
                                      Progreso del plan
                                    </Text>
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 py-5 px-5 lg:px-10 flex flex-1 flex-col items-center justify-center">
                                      <img
                                        loading="lazy"
                                        src={encontrado}
                                        alt="Mascota encontrada"
                                      />
                                    </div>
                                  </div>
                                )}
                                {petData.planStatus === 'continua' && (
                                  <PlanProgressSection petData={petData} />
                                )}
                              </div>
                              <div className="lg:col-span-6 lg:h-full">
                                <AdProgressSection posterUrl={posterUrl} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientDashboardOverview;
