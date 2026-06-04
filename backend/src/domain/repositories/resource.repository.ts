import type { ContentBlock } from '@/types/content.types';

export interface Resource {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  content: ContentBlock[];
  resourceUrl: string;
  emailContent?: string;
  description?: string;
  category?: string[];
}

export type PartialResourceWithId = Partial<Resource> & Pick<Resource, '_id'>;

export interface SearchTerm {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
}

export interface ResourceResult {
  resources: Resource[];
  total: number;
}

export interface ResourceRepository {
  // getResources(searchTerm: SearchTerm): Promise<Resource[]>;
  // getResourceById(id: string): Promise<Resource>;
  updateResourceById(updateInfo: PartialResourceWithId): Promise<boolean>;
}
