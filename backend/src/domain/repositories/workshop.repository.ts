import type { Workshop } from '@domain/models/workshop.model';

export interface CreateWorkshop {
  workshopId: string | null;
  error: string | null;
}

export interface GetWorkshop {
  page?: number;
  searchTerm?: string;
  sortOption: string;
}

export interface WorkshopRepository {
  createWorkshop(workshop: Workshop): Promise<CreateWorkshop>;
  getWorkshops(workshopRequest: GetWorkshop): Promise<Workshop[]>;
  getTotalWorkshops(workshopRequest: GetWorkshop): Promise<number>;
  getWorkshopById(id: string): Promise<Workshop | null>;
  getWorkshopByCategory(
    categories: string[],
    page: number,
  ): Promise<Workshop[]>;
}
