import { useEffect, useState } from 'react';
import { getDashboardMetrics } from '../services/graphs.service';
import type { DashboardResponse } from '../types/dashboardMetrics';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics();
        setMetrics(data);
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
