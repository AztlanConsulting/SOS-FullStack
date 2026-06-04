import type { ContentBlock } from './content.types';

export interface Resource {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  content: ContentBlock[];
  resourceUrl: string;
  emailContent?: string;
}

export type PartialResourceWithId = Partial<Resource> & Pick<Resource, '_id'>;
