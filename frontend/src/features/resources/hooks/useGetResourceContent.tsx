import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import type { Resource } from '../types/resource';

export default function useGetResourceContent<T>(
  queryFunction: (id: string) => Promise<T>,
) {
  const { state } = useLocation();
  const { id } = useParams();

  const query = useQuery({
    queryKey: ['resource', id],
    queryFn: async () => await queryFunction(id ?? ''),
    enabled: !state?.resource && !!id,
  });

  const { isLoading, error } = query;
  const resource: Resource = state?.resource || query.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return {
    isLoading,
    error,
    resource,
  };
}
