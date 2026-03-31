import { PlanProgress } from '../../model/plans/PlanProgress';

export const getPlanProgressUseCase = async (): Promise<PlanProgress> => {
  // Simulamos un retraso de red de medio segundo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        planName: 'Plan Premium',
        totalDays: 30,
        daysRemaining: 12, // El usuario lleva 18 días consumidos
      });
    }, 500);
  });
};
