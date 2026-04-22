import { PlanModel } from '@/domain/models/plan.model';

async function initPlanDB() {
  const plans = [
    { name: 'Básico', price: 390 },
    { name: 'Estándar', price: 840 },
    { name: 'Premium', price: 1600 },
  ];

  await PlanModel.insertMany(plans);
}

export default initPlanDB;
