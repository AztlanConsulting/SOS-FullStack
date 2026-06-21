import type { Blog } from '@/features/blog/types/blog.types';
import type { LocalBlock } from '@/shared/hooks/useCreateResource';
import type { AxiosResponse } from 'axios';
import type { Dispatch, SetStateAction } from 'react';

export interface BlogElement {
  edit: boolean;
}

export type BlogDependencies = {
  blog: Blog | undefined;
  coverImage: File | null;
  blocks: LocalBlock[];
  title: string;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
  editBlog: (
    blog: Pick<Partial<Blog>, '_id'>,
  ) => Promise<AxiosResponse<any, any, {}>>;
};
