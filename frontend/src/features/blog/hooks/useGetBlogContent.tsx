import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';

export default function useGetBlogContent<T>(
  queryFunction: (id: string) => Promise<T>,
) {
  const { state } = useLocation();
  const { id } = useParams();
  const query = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => await queryFunction(id ?? ''),
    enabled: !state?.blog && !!id,
  });

  const { isLoading, error } = query;
  const blog = state?.blog || query.data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return {
    isLoading,
    error,
    blog,
  };
}
