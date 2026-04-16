import type { Workshop } from '@domain/models/workshop.model';
import type {
  GetWorkshop,
  WorkshopRepository,
} from '@domain/repositories/workshop.repository';

export async function getWorkshopList(
  workshopImpl: WorkshopRepository,
  workshopRequest: GetWorkshop,
): Promise<{ workshops: Workshop[]; totalWorkshops: number }> {
  const workshops: Workshop[] =
    await workshopImpl.getWorkshops(workshopRequest);
  const totalWorkshops = await workshopImpl.getTotalWorkshops(workshopRequest);
  return { workshops, totalWorkshops };
}

export async function getWorkshopById(
  workshopImpl: WorkshopRepository,
  id: string,
): Promise<Workshop | null> {
  const workshops: Workshop | null = await workshopImpl.getWorkshopById(id);
  return workshops;
}
