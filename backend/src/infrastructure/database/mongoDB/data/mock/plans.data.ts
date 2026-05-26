import { PlanModel } from '@/domain/models/plan.model';

async function initPlanDB() {
  const plans = [
    { name: 'Básico', price: 22.55 },
    { name: 'Estándar', price: 48.62 },
    { name: 'Premium', price: 92.6 },
  ];

  await PlanModel.insertMany(plans);
}

export default initPlanDB;
