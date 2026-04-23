import type { Workshop } from '@domain/models/workshop.model';
import type {
  GetWorkshop,
  WorkshopRepository,
} from '@domain/repositories/workshop.repository';
import { normalizeContent } from '@utils/content.mapper';

export async function getWorkshopList(
  workshopImpl: WorkshopRepository,
  workshopRequest: GetWorkshop,
): Promise<{ workshops: Workshop[]; totalWorkshops: number }> {
  const workshops: Workshop[] =
    await workshopImpl.getWorkshops(workshopRequest);

  const totalWorkshops = await workshopImpl.getTotalWorkshops(workshopRequest);

  return { workshops: workshops.map(normalizeWorkshop), totalWorkshops };
}

export async function getWorkshopById(
  workshopImpl: WorkshopRepository,
  id: string,
): Promise<Workshop | null> {
  const workshop: Workshop | null = await workshopImpl.getWorkshopById(id);

  if (!workshop) return null;

  return normalizeWorkshop(workshop);
}

/**
 * Normalizes a Workshop entity.
 *
 * @param workshop - Workshop document or plain object
 * @returns Normalized WQorkshop
 */
function normalizeWorkshop(workshop: Workshop): Workshop {
  const plainWorkshop =
    typeof (workshop as Workshop & { toObject?: () => Workshop }).toObject ===
    'function'
      ? (workshop as Workshop & { toObject: () => Workshop }).toObject()
      : workshop;

  return {
    ...plainWorkshop,
    price: typeof plainWorkshop.price === 'number' ? plainWorkshop.price : 0,
    content: normalizeContent(plainWorkshop.content),
    category: Array.isArray(plainWorkshop.category)
      ? plainWorkshop.category
      : [],
    imageUrl: plainWorkshop.imageUrl ?? '',
  };
}
