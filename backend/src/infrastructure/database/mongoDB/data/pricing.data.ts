import { PlanModel } from '@/domain/models/plan.model';
import { WorkshopModel } from '@/domain/models/workshop.model';
import { ManualModel } from '@/domain/models/manual.model';

export const initPriceDB = async () => {
  await PlanModel.insertMany([
    { name: 'Basic', price: 23 },
    { name: 'Standard', price: 49 },
    { name: 'Premium', price: 93 },
  ]);

  await WorkshopModel.insertMany([
    {
      name: 'Taller de búsqueda',
      price: 500,
      description: 'Taller de prueba',
      content: [],
      category: [],
      imageUrl: 'https://placehold.co/400',
    },
  ]);

  await ManualModel.insertMany([
    {
      name: 'Manual de búsqueda básico',
      price: 199,
      content: [],
      imageUrl: 'https://placehold.co/400',
    },
    {
      name: 'Manual de búsqueda avanzado',
      price: 349,
      content: [],
      imageUrl: 'https://placehold.co/400',
    },
  ]);
};
