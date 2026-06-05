export type WorkshopItemType = 'manual' | 'taller';

export type ContentBlockType = 'texto' | 'image' | 'link';

export interface TextContentBlock {
  kind: 'texto';
  value: string;
}

export interface ImageContentBlock {
  kind: 'imagen';
  file: File;
  previewUrl: string;
}

export interface LinkContentBlock {
  kind: 'link';
  value: string;
}

export type ContentBlock =
  | TextContentBlock
  | ImageContentBlock
  | LinkContentBlock;

export interface CreateWorkshopItemPayload {
  type: WorkshopItemType;
  name: string;
  price: number;
  imageUrl: string;
  content: { type: ContentBlockType; content: string }[];
  // taller-specific
  description?: string;
  category?: string[];
  videoUrl?: string;
  emailContent?: string;
  // manual-specific
  pdfUrl?: string;
}

export interface CreateWorkshopItemResponse {
  id: string;
  type: WorkshopItemType;
}
