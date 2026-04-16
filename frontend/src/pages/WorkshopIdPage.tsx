import WorkshopContent from '@features/workshop/components/WorkshopContent';
import useGetWorkshopContent from '@features/workshop/hooks/useGetWorkshopContent';
import queryWorkshopById from '@features/workshop/services/queryWorkshopById';
import type { Workshop } from '@features/workshop/types/workshop';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';

const WorkshopIdPage = () => {
  const { isLoading, error, workshop } =
    useGetWorkshopContent<Workshop>(queryWorkshopById);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <Text>Error no se pudo encontrar el taller especificado</Text>;

  return (
    <div className="min-h-screen">
      <main>
        {workshop ? (
          <WorkshopContent workshop={workshop} />
        ) : (
          <div>Taller no encontrado</div>
        )}
      </main>
    </div>
  );
};

export default WorkshopIdPage;
