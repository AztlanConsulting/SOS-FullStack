import { useEffect, useState } from 'react';
import type { DashboardStats } from '@features/graphs/types/dashboardMetrics';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data: DashboardStats = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              plan: {
                planName: 'Plan Premium',
                totalDays: 15,
                daysRemaining: 6,
              },
              distribution: [
                { name: 'Plan A', value: 30 },
                { name: 'Plan B', value: 50 },
                { name: 'Plan C', value: 20 },
                { name: 'Plan personalizado', value: 20 },
              ],
              sales: [
                { name: 'México', value: 30 },
                { name: 'Chile', value: 45 },
                { name: 'Colombia', value: 60 },
                { name: 'Venezuela', value: 55 },
              ],
              visits: [
                { day: 1, val: 10 },
                { day: 2, val: 20 },
                { day: 3, val: 45 },
                { day: 4, val: 60 },
                { day: 5, val: 80 },
              ],
            });
          }, 500); // Para simular la carga de datos
        });

        setMetrics(data);
      } catch (err) {
        setError('Error al cargar métricas');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { metrics, loading, error };
};
