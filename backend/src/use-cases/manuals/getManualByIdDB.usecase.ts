import type { ManualRepository } from '@domain/repositories/manual.repository';
import type { ManualResult } from '@domain/repositories/manual.repository';

export const getManualByIdDB = async (
  manualRepository: ManualRepository,
  id: string,
): Promise<ManualResult | null> => {
  return await manualRepository.getManualById(id);
};
