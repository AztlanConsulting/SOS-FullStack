import type { ManualRepository } from '@domain/repositories/manual.repository';
import type { ManualResult } from '@domain/repositories/manual.repository';
import { ManualModel } from '@domain/models/manual.model';

export const ManualDataAccess: ManualRepository = {
  async getManuals(): Promise<ManualResult[]> {
    return await ManualModel.find();
  },
  async getManualById(id: string): Promise<ManualResult | null> {
    return await ManualModel.findById(id);
  },
};
