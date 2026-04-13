import type { Workshop } from '@domain/models/workshop.model';
import type { WorkshopRepository } from '@domain/repositories/workshop.repository';

export async function getWorkshopList(
  workshopImpl: WorkshopRepository,
  page: number = 0,
): Promise<Workshop[]> {
  const workshops: Workshop[] = await workshopImpl.getWorkshops(page);
  return workshops;
}

export async function getWorkshopById(
  workshopImpl: WorkshopRepository,
  id: string,
): Promise<Workshop> {
  const workshops: Workshop = await workshopImpl.getWorkshopById(id);
  return workshops;
}
