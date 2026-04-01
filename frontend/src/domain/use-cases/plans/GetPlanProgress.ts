import { PlanProgress } from '../../model/plans/PlanProgress';

export const getPlanProgressUseCase = async (): Promise<PlanProgress> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        planName: 'Plan Premium',
        totalDays: 30,
        daysRemaining: 12,
      });
    }, 500);
  });
};
