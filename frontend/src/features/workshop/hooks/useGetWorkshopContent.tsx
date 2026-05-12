import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { useLocationContext } from '@shared/context/Location.context';

export default function useGetWorkshopContent<T>(
  queryFunction: (id: string) => Promise<T>,
) {
  const { state } = useLocation();
  const { id } = useParams();
  const { workshops: localizedWorkshops, currencyCode } = useLocationContext();

  const query = useQuery({
    queryKey: ['workshop', id],
    queryFn: async () => await queryFunction(id ?? ''),
    enabled: !state?.workshop && !!id,
  });

  const { isLoading, error } = query;
  const workshop = state?.workshop || query.data;

  /**
   * Looks up the localized price for a workshop by name.
   * Falls back to the original DB price if not found.
   */
  const getLocalizedPrice = (name: string, fallbackPrice: number): number => {
    const localized = localizedWorkshops.find((w) => w.name === name);
    return localized?.localizedPrice ?? fallbackPrice;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return {
    isLoading,
    error,
    workshop,
    getLocalizedPrice,
    currencyCode,
  };
}
