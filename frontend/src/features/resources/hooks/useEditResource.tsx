import { useState } from 'react';
import { ResourceService } from '../services/resourceItem.service';
import type { Resource } from '../types/resource';
import parseResourceBlock from '../util/parseResourceBlock';

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
export const useEditResource = (
  resource: Resource | null,
  file: File | null,
  onSuccess: () => void,
) => {
  const idHook = useState(resource?._id!);
  const [name, setNameRaw] = useState(resource?.name!);
  const [type, setType] = useState<string>(resource?.type!);
  const [price, setPrice] = useState(String(resource?.price!));
  const blocksHook = useState<LocalBlock[]>(
    parseResourceBlock(resource?.content!),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const secretUrlHook = useState(resource?.resourceUrl!);
  const [coverImage, setCoverImageRaw] = useState<File | null>(file);
  const coverPreviewHook = useState('');
  const coverDisplayHeightHook = useState(144);
  const [emailContent, setEmailContentRaw] = useState(resource?.emailContent!);

  const [id] = idHook;
  const [blocks, setBlocks] = blocksHook;
  const [coverPreview, setCoverPreview] = coverPreviewHook;
  const [secretUrl] = secretUrlHook;

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
      const coverUrl = await ResourceService.uploadImage(coverImage);

      const serialised = await Promise.all(
        blocks.map(async (block) => {
          if (block.kind === 'texto')
            return { type: 'texto' as const, content: block.value }; // value → content
          if (block.kind === 'link')
            return {
              type: 'link' as const,
              content: normaliseLink(block.value),
            }; // value → content
          const base64 = await ResourceService.uploadImage(block.file!);
          return { type: 'image' as const, content: base64 }; // value → content
        }),
      );

      const response = await ResourceService.updateResource({
        _id: id,
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

      if (!secretUrl.trim()) {
        setError(
          type === 'manual'
            ? 'El PDF URL es requerido'
            : 'El Video URL es requerido',
        );
        return;
      }

      if (type === 'taller' && !emailContent.trim()) {
        setError('El contenido del correo es requerido');
        return;
      }

      onSuccess?.();
    } catch {
      setError('Ocurrió un error al guardar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const nameHook = [name, setName] as const;
  const typeHook = [type, setType] as const;
  const priceHook = [price, setPrice] as const;
  const coverImageHook = [coverImage, setCoverImage] as const;
  const emailHook = [emailContent, setEmailContent] as const;
  const updateBlocks = {
    updateTextBlock,
    updateLinkBlock,
    updateImageBlock,
    removeBlock,
  };

  return {
    nameHook,
    typeHook,
    priceHook,
    secretUrlHook,
    coverImageHook,
    coverDisplayHeightHook,
    blocks,
    loading,
    error,
    canAddBlock: blocks.length < MAX_BLOCKS,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_PRICE,
    addBlock,
    updateBlocks,
    handleSubmit,
    coverPreview,
    emailHook,
    MAX_EMAIL_CONTENT_LENGTH,
  };
};
