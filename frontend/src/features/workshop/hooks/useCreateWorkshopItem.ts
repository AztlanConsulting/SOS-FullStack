import { useState } from 'react';
import type { WorkshopItemType } from '@/features/workshop/types/workshopItem';
import { WorkshopItemService } from '@/features/workshop/services/workshopItem';

// ── Hard limits (must mirror backend validation) ──────────────────────────────
export const MAX_NAME_LENGTH = 100;
export const MAX_TEXT_LENGTH = 400;
export const MAX_LINK_LENGTH = 100;
export const MAX_PRICE = 99_999;
export const MAX_BLOCKS = 10;
export const MAX_FILE_SIZE_MB = 5;
export const MAX_EMAIL_CONTENT_LENGTH = 400;

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
  previewUrl: string;
  displayHeight: number;
}
export type LocalBlock = TextBlock | LinkBlock | ImageBlock;

const normaliseLink = (v: string) =>
  /^https?:\/\//i.test(v.trim()) ? v.trim() : `https://${v.trim()}`;

/**
 * Hook that owns all state and submit logic for RegisterWorkshopItemModal.
 */
export const useCreateWorkshopItem = (onSuccess?: () => void) => {
  const [name, setNameRaw] = useState('');
  const [type, setType] = useState<WorkshopItemType>('taller');
  const [price, setPrice] = useState('');
  const [blocks, setBlocks] = useState<LocalBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secretUrl, setSecretUrl] = useState('');
  const [coverImage, setCoverImageRaw] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [coverDisplayHeight, setCoverDisplayHeight] = useState(144);
  const [emailContent, setEmailContentRaw] = useState('');

  // guard name length
  const setName = (v: string) => {
    if (v.length <= MAX_NAME_LENGTH) setNameRaw(v);
  };

  // ── block helpers ───────────────────────────────────────────────────────────
  const addBlock = (kind: LocalBlock['kind']) => {
    if (blocks.length >= MAX_BLOCKS) return;
    if (kind === 'texto')
      setBlocks((p) => [...p, { kind: 'texto', value: '' }]);
    if (kind === 'link') setBlocks((p) => [...p, { kind: 'link', value: '' }]);
    if (kind === 'imagen')
      setBlocks((p) => [
        ...p,
        { kind: 'imagen', file: null, previewUrl: '', displayHeight: 128 },
      ]);
  };

  const updateTextBlock = (i: number, value: string) => {
    if (value.length > MAX_TEXT_LENGTH) return;
    setBlocks((p) =>
      p.map((b, idx) =>
        idx === i && b.kind === 'texto' ? { ...b, value } : b,
      ),
    );
  };

  const setEmailContent = (v: string) => {
    if (v.length <= MAX_EMAIL_CONTENT_LENGTH) setEmailContentRaw(v);
  };

  const updateLinkBlock = (i: number, value: string) => {
    if (value.length > MAX_LINK_LENGTH) return;
    setBlocks((p) =>
      p.map((b, idx) => (idx === i && b.kind === 'link' ? { ...b, value } : b)),
    );
  };

  /**
   * updateImageBlock handles two cases:
   *  - file !== null  → new file selected (validates size, creates preview)
   *  - file === null  → only the displayHeight slider changed
   */
  const updateImageBlock = (
    i: number,
    file: File | null,
    displayHeight?: number,
  ) => {
    if (file !== null) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB) {
        setError(`La imagen no puede superar ${MAX_FILE_SIZE_MB} MB`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setBlocks((p) =>
        p.map((b, idx) =>
          idx === i && b.kind === 'imagen'
            ? { ...b, file, previewUrl, displayHeight: b.displayHeight }
            : b,
        ),
      );
    } else if (displayHeight !== undefined) {
      setBlocks((p) =>
        p.map((b, idx) =>
          idx === i && b.kind === 'imagen' ? { ...b, displayHeight } : b,
        ),
      );
    }
  };

  const setCoverImage = (file: File | null) => {
    if (!file) {
      setCoverImageRaw(null);
      setCoverPreview('');
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setError(`La imagen no puede superar ${MAX_FILE_SIZE_MB} MB`);
      return;
    }
    setCoverImageRaw(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeBlock = (i: number) =>
    setBlocks((p) => p.filter((_, idx) => idx !== i));

  // ── submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError('El título es requerido');
      return;
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      setError(`El título no puede superar ${MAX_NAME_LENGTH} caracteres`);
      return;
    }
    const priceNum = parseInt(price, 10);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      setError('Ingresa un precio válido');
      return;
    }
    if (priceNum > MAX_PRICE) {
      setError(
        `El precio no puede superar ${MAX_PRICE.toLocaleString('en-US')} USD`,
      );
      return;
    }

    if (!coverImage) {
      setError('Agrega una imagen de portada');
      return;
    }

    setLoading(true);
    try {
      const coverUrl = await WorkshopItemService.uploadImage(coverImage);

      const serialised = await Promise.all(
        blocks.map(async (block) => {
          if (block.kind === 'texto')
            return { type: 'texto' as const, content: block.value }; // value → content
          if (block.kind === 'link')
            return {
              type: 'link' as const,
              content: normaliseLink(block.value),
            }; // value → content
          const base64 = await WorkshopItemService.uploadImage(block.file!);
          return { type: 'image' as const, content: base64 }; // value → content
        }),
      );

      await WorkshopItemService.createWorkshopItem({
        type,
        name: name.trim(),
        price: priceNum,
        imageUrl: coverUrl,
        content: serialised,
        ...(type === 'taller' && {
          description: name.trim(),
          videoUrl: secretUrl.trim(),
          emailContent: emailContent.trim(),
        }),
        ...(type === 'manual' && { pdfUrl: secretUrl.trim() }),
      });

      onSuccess?.();
    } catch {
      setError('Ocurrió un error al guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setNameRaw('');
    setType('taller');
    setPrice('');
    setBlocks([]);
    setError(null);
    setCoverImageRaw(null);
    setCoverPreview('');
    setEmailContentRaw('');
  };

  return {
    name,
    setName,
    type,
    setType,
    price,
    setPrice,
    blocks,
    loading,
    error,
    canAddBlock: blocks.length < MAX_BLOCKS,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_PRICE,
    addBlock,
    updateTextBlock,
    updateLinkBlock,
    updateImageBlock,
    removeBlock,
    handleSubmit,
    reset,
    secretUrl,
    setSecretUrl,
    coverImage,
    coverPreview,
    setCoverImage,
    coverDisplayHeight,
    setCoverDisplayHeight,
    emailContent,
    setEmailContent,
    MAX_EMAIL_CONTENT_LENGTH,
  };
};
