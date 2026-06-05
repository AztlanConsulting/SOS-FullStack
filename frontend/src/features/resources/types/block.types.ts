// ── Types ─────────────────────────────────────────────────────────────────────
export interface TextBlock {
  kind: 'texto';
  value: string;
}
export interface LinkBlock {
  kind: 'link';
  value: string;
}
export interface ImageBlock {
  kind: 'imagen';
  file: File | null;
  originalString?: string;
  previewUrl: string;
  displayHeight: number;
}
export type LocalBlock = TextBlock | LinkBlock | ImageBlock;
