import type { Workshop } from '@domain/models/workshop.model';
import type { WorkshopRepository } from '@domain/repositories/workshop.repository';

export async function createWorkshop(
  workshopImpl: WorkshopRepository,
  workshop: Workshop,
) {
  const response = await workshopImpl.createWorkshop(workshop);

  if (response.error !== null) throw Error(response.error);

  return response.workshopId;
}
