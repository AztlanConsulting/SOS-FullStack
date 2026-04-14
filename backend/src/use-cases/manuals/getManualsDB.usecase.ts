import type { ManualRepository } from '@domain/repositories/manual.repository';
import type { ManualResult } from '@domain/repositories/manual.repository';

export const getManualsDB = async (
  manualRepository: ManualRepository,
): Promise<ManualResult[]> => {
  return await manualRepository.getManuals();
};
