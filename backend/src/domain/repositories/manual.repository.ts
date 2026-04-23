import type { ContentBlock } from '@validation/content.types';

export interface ManualResult {
  name: string;
  price: number;
  content: ContentBlock[];
  imageUrl: string;
}

export interface GetManual {
  page?: number;
  searchTerm?: string;
  sortOption: string;
}

export interface ManualRepository {
  getManuals(manualRequest: GetManual): Promise<ManualResult[]>;
  getTotalManuals(manualRequest: GetManual): Promise<number>;
  getManualById(id: string): Promise<ManualResult | null>;
}
