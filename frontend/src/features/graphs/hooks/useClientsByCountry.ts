import axiosInstance from '@/shared/utils/axios';
import { useEffect, useState } from 'react';

export interface CountryMetric {
  name: string;
  value: number;
}

/**
 * Custom hook to fetch and manage demographic metrics aggregated by country.
 * * Perfect for powering dashboard widgets such as geographical map charts,
 * data tables, or bar graphs tracking distribution.
 *
 * @returns {Object} `{ data, loading, error }` - UI lifecycle state for analytical metrics.
 */
export const useClientsByCountry = () => {
  const [data, setData] = useState<CountryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Controller to abort asynchronous requests if component unmounts mid-flight
    const fetchData = async () => {
      try {
        const result = await axiosInstance.get('/metrics/clients-by-country');
        console.log(result.data);
        setData(result.data);
      } catch {
        setError('Error al cargar distribución por país');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
