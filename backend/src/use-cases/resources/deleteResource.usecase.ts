import type { ManualRepository } from '@domain/repositories/manual.repository';
import type { WorkshopRepository } from '@domain/repositories/workshop.repository';

export async function deleteResource(
  workshopRepository: WorkshopRepository,
  manualRepository: ManualRepository,
  id: string,
): Promise<boolean> {
  const workshopDeleted = await workshopRepository.deleteWorkshop(id);
  if (workshopDeleted) return true;

  const manualDeleted = await manualRepository.deleteManual(id);
  return manualDeleted;
}
