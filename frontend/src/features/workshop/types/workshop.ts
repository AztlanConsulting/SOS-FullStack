import type { ContentBlock } from '@shared/types/content.types';

export type Workshop = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string[];
  image?: Buffer;
  imageUrl: string;
  content: ContentBlock[];
};

export type WorkshopResult = {
  workshops: Workshop[];
  total: number;
};
