import type { WorkshopRepository } from '@domain/repositories/workshop.repository';

export async function deleteWorkshop(
  workshopImpl: WorkshopRepository,
  id: string,
): Promise<boolean> {
  return await workshopImpl.deleteWorkshop(id);
}
