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

export interface CreateManualInput {
  name: string;
  price: number;
  imageUrl: string;
  content: ContentBlock[];
  pdfUrl?: string;
}

export interface CreateManual {
  manualId: string | null;
  error: string | null;
}

export interface ManualRepository extends ResourceRepository {
  getManuals(manualRequest: GetManual): Promise<ManualResult[]>;
  getTotalManuals(manualRequest: GetManual): Promise<number>;
  getManualById(id: string): Promise<ManualResult | null>;
  createManual(manual: CreateManualInput): Promise<CreateManual>;
  deleteManual(id: string): Promise<boolean>;
}
