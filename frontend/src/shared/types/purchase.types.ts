import type { ContentBlock } from '@shared/types/content.types';

export type PurchaseRequest = {
  _id: string;
  item: string;
  price: number;
  url: string;
};

export type Product = {
  _id: string;
  imageUrl: string;
  name: string;
  content: ContentBlock[];
  price: number;
};
