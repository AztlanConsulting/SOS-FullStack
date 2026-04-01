import type { DashboardMetrics } from '../../model/dashboard/DashboardMetrics';

export const getDashboardMetricsUseCase =
  async (): Promise<DashboardMetrics> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          plan: {
            planName: 'Plan Premium',
            totalDays: 15,
            daysRemaining: 10,
          },
          distribution: [
            { name: 'Tipo A', value: 30 },
            { name: 'Tipo B', value: 50 },
            { name: 'Tipo C', value: 20 },
          ],
          sales: [
            { name: 'Ene', value: 30 },
            { name: 'Feb', value: 45 },
            { name: 'Mar', value: 60 },
            { name: 'Abr', value: 55 },
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
  };
