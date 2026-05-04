import { useEffect, useState } from 'react';
import axios from '@shared/utils/axios';
import type { DashboardResponse } from '../types/dashboardMetrics';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<DashboardResponse>('clients/inicio');
        setMetrics(response.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la información del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { metrics, loading, error };
};
