import { ManualDataAccess } from '../../interfaces/data-access/manual.data-access';
import type { ManualResult } from '@domain/repositories/manual.repository';

export const getManualsDB = async (): Promise<ManualResult[]> => {
  return await ManualDataAccess.getManuals();
};
