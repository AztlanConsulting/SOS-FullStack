import type { Workshop } from '@domain/models/workshop.model';
import type { WorkshopRepository } from '@domain/repositories/workshop.repository';

export async function getWorkshopList(
  workshopImpl: WorkshopRepository,
  page: number = 0,
): Promise<{ workshops: Workshop[]; totalWorkshops: number }> {
  const workshops: Workshop[] = await workshopImpl.getWorkshops(page);
  const totalWorkshops = await workshopImpl.getTotalWorkshops();
  return { workshops, totalWorkshops };
}

export async function getWorkshopById(
  workshopImpl: WorkshopRepository,
  id: string,
): Promise<Workshop | null> {
  const workshops: Workshop | null = await workshopImpl.getWorkshopById(id);
  return workshops;
}
