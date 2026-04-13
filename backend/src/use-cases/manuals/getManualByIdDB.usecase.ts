import { ManualDataAccess } from '@interfaces/data-access/manual.data-access';
import type { ManualResult } from '@domain/repositories/manual.repository';

export const getManualByIdDB = async (
  id: string,
): Promise<ManualResult | null> => {
  return await ManualDataAccess.getManualById(id);
};
