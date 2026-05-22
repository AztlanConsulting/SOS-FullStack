import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';

export default function useGetMembersOnlyContent<T>(
  queryFunction: (id: string) => Promise<T>,
) {
  const { state } = useLocation();
  const { id } = useParams();
  const query = useQuery({
    queryKey: ['membersOnly', id],
    queryFn: async () => await queryFunction(id ?? ''),
    enabled: !state?.membersOnly && !!id,
  });

  const { isLoading, error } = query;
  const membersOnly = state?.membersOnly || query.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return {
    isLoading,
    error,
    membersOnly,
  };
}
