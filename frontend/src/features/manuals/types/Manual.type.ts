import type { ContentBlock } from '@shared/types/content.types';

export type Manual = {
  _id: string;
  name: string;
  price: number;
  content: ContentBlock[];
  imageUrl: string;
};

export type ManualResult = {
  manuals: Manual[];
  total: number;
};
