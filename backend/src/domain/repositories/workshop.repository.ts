import type { Workshop } from '@domain/models/workshop.model';
import type { ResourceRepository } from './resource.repository';

export interface CreateWorkshop {
  workshopId: string | null;
  error: string | null;
}

export interface GetWorkshop {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
}

export interface WorkshopRepository extends ResourceRepository {
  createWorkshop(workshop: Workshop): Promise<CreateWorkshop>;
  getWorkshops(workshopRequest: GetWorkshop): Promise<Workshop[]>;
  getTotalWorkshops(workshopRequest: GetWorkshop): Promise<number>;
  getWorkshopById(id: string): Promise<Workshop | null>;
  getWorkshopByCategory(
    categories: string[],
    page: number,
  ): Promise<Workshop[]>;
  deleteWorkshop(id: string): Promise<boolean>;
}
