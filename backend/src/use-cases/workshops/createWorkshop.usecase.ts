import type { WorkshopBody } from '@validation/workshop';
import type { Workshop } from '@domain/models/workshop.model';
import type { WorkshopRepository } from '@domain/repositories/workshop.repository';

export async function createWorkshop(
  workshopImpl: WorkshopRepository,
  workshopData: WorkshopBody,
  image: Buffer,
) {
  const workshop: Workshop = {
    ...workshopData,
    img: image,
  };

  const response = await workshopImpl.createWorkshop(workshop);

  if (response.error !== null) throw Error(response.error);

  return response.workshopId;
}
