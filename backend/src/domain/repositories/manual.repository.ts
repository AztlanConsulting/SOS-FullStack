import type { ContentBlock } from '@validation/content.types';
import type { ResourceRepository } from './resource.repository';

export interface ManualResult {
  name: string;
  price: number;
  content: ContentBlock[];
  imageUrl: string;
  pdfUrl?: string;
  emailContent?: string;
}

export interface GetManual {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
}

export interface ManualRepository extends ResourceRepository {
  getManuals(manualRequest: GetManual): Promise<ManualResult[]>;
  getTotalManuals(manualRequest: GetManual): Promise<number>;
  getManualById(id: string): Promise<ManualResult | null>;
}
