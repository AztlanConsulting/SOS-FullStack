import type { ContentBlock } from '@shared/types/content.types';

export type Blog = {
  _id: string;
  name: string;
  duration: number;
  content: ContentBlock[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogResult = {
  blogs: Blog[];
  total: number;
};
