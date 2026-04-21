import type { FoundPetReport } from '@domain/models/foundPet.model';
import { FoundPetModel } from '@domain/models/foundPet.model';
import type {
  FoundPetRepository,
  FoundPetResult,
} from '@domain/repositories/foundPet.repository';

export const FoundPetDataAccess: FoundPetRepository = {
  async createFoundPet(foundPetData: FoundPetReport): Promise<FoundPetResult> {
    const created = await FoundPetModel.create(foundPetData);
    return created.toObject() as unknown as FoundPetResult;
  },

  async getFoundPetById(id: string): Promise<FoundPetResult | null> {
    const found = await FoundPetModel.findById(id);
    return found?.toObject() as unknown as FoundPetResult | null;
  },

  async getAllFoundPets(): Promise<FoundPetResult[]> {
    const results = await FoundPetModel.find();
    return results.map((doc) => doc.toObject()) as unknown as FoundPetResult[];
  },

  async updateFoundPet(
    id: string,
    foundPetData: Partial<FoundPetReport>,
  ): Promise<FoundPetResult | null> {
    const updated = await FoundPetModel.findByIdAndUpdate(id, foundPetData, {
      new: true,
    });
    return updated?.toObject() as unknown as FoundPetResult | null;
  },

  async deleteFoundPet(id: string): Promise<boolean> {
    const deleted = await FoundPetModel.findByIdAndDelete(id);
    return deleted !== null;
  },
};
