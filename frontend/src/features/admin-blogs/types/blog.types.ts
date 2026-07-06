import type { Blog } from '@/features/blog/types/blog.types';
import type { LocalBlock } from '@/shared/hooks/useCreateResource';
import type { Dispatch, SetStateAction } from 'react';

export interface BlogElement {
  edit: boolean;
}

export type BlogDependencies = {
  blog: Blog;
  coverImage: File | null;
  blocks: LocalBlock[];
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
};

export type BlogStatsSchema = {
  published: number;
  drafts: number;
  comparison: number;
};
