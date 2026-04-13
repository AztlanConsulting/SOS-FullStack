import type { Workshop } from '@domain/models/workshop.model';
import { PaymentProvider } from '@domain/ports/paymentProvider.port';

export interface WorkshopRepository {
  createWorkshop(workshop: Workshop): Promise<boolean>;
  getWorkshops(page: number): Promise<Workshop[]>;
  getWorkshopById(id: string): Promise<Workshop | null>;
  getWorkshopByCategory(
    categories: string[],
    page: number,
  ): Promise<Workshop[]>;
}
