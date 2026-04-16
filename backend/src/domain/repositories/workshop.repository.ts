import type { Workshop } from '@domain/models/workshop.model';

export interface CreateWorkshop {
  workshopId: string | null;
  error: string | null;
}

export interface WorkshopRepository {
  createWorkshop(workshop: Workshop): Promise<CreateWorkshop>;
  getWorkshops(page: number): Promise<Workshop[]>;
  getTotalWorkshops(): Promise<number>;
  getWorkshopById(id: string): Promise<Workshop | null>;
  getWorkshopByCategory(
    categories: string[],
    page: number,
  ): Promise<Workshop[]>;
}
