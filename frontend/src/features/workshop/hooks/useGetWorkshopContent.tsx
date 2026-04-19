import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';

export default function useGetWorkshopContent<T>(
  queryFunction: (id: string) => Promise<T>,
) {
  const { state } = useLocation();
  const { id } = useParams();
  const query = useQuery({
    queryKey: ['workshop', id],
    queryFn: async () => await queryFunction(id ?? ''),
    enabled: !state?.workshop && !!id,
  });

  const { isLoading, error } = query;
  const workshop = state?.workshop || query.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return {
    isLoading,
    error,
    workshop,
  };
}
