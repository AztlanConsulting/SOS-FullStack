import WorkshopContent from '@features/workshop/components/WorkshopContent';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import axiosInstance from '@shared/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { Text } from '@shared/components/ui/Text';

const WorkshopIdPage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const query = useQuery({
    queryKey: ['workshop', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/workshop/`, {
        params: { id },
      });
      return data.workshops;
    },
    enabled: !state?.workshop && !!id,
  });

  const { isLoading, error } = query;
  const workshop = state?.workshop || query.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
