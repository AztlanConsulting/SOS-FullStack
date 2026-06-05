import { useRef, useState } from 'react';
import type {
  ContentBlockType,
  WorkshopItemType,
} from '@/features/workshop/types/workshopItem';
import { WorkshopItemService } from '@/features/workshop/services/workshopItem';
import { ResourceService } from '@/features/resources/services/resourceItem.service';
import type { LocalBlock } from '@/features/resources/types/block.types';

// ── Hard limits (must mirror backend validation) ──────────────────────────────
export const MAX_NAME_LENGTH = 100;
export const MAX_TEXT_LENGTH = 400;
export const MAX_LINK_LENGTH = 100;
export const MAX_PRICE = 99_999;
export const MAX_BLOCKS = 10;
export const MAX_FILE_SIZE_MB = 5;
export const MAX_EMAIL_CONTENT_LENGTH = 400;

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
  // Field-level error state
  const errorTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // guard name length
  const setName = (v: string) => {
    if (v.length <= MAX_NAME_LENGTH) setNameRaw(v);
  };

  // Auto-dismiss error after 5 seconds
  const setFieldError = (field: string, message: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message }));

    // Clear any existing timeout for this field
    if (errorTimeoutRef.current[field]) {
      clearTimeout(errorTimeoutRef.current[field]);
    }

    // Set new timeout
    errorTimeoutRef.current[field] = setTimeout(() => {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
      delete errorTimeoutRef.current[field];
    }, 100000000);
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
      console.log('sizeMB', sizeMB);
      setError(`La imagen no puede superar ${MAX_FILE_SIZE_MB} MB`);
      setFieldError('cover', 'La imagen no puede superar los 5MB');
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
          console.log(block);
          if (block.kind === 'texto')
            return {
              type: block.kind as ContentBlockType,
              content: block.value,
            }; // value → content
          if (block.kind === 'link')
            return {
              type: block.kind as ContentBlockType,
              content: normaliseLink(block.value),
            }; // value → content
          if (
            block.kind === 'imagen' &&
            block.file?.name != 'defaultImage.jpg'
          ) {
            const imageUrl = await ResourceService.uploadImage(block.file!);
            return { type: block.kind as ContentBlockType, content: imageUrl }; // value → content
          } else {
            return {
              type: block.kind as ContentBlockType,
              content: block.originalString ?? '',
            };
          }
        }),
      );

      await ResourceService.createWorkshopItem({
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
    errorTimeoutRef,
    fieldErrors,
    setFieldError,
    setFieldErrors,
  };
};
