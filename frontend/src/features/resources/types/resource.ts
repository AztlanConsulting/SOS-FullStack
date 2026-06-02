import type { ContentBlock } from '@shared/types/content.types';

export type Resource = {
  _id: string;
  name: string;
  type: string;
  price: number;
  imageUrl?: string;
  content: ContentBlock[];
  resourceUrl: string;
  emailContent?: string;
};

export type ResourceResult = {
  resources: Resource[];
  total: number;
};
