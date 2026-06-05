import { useEffect, useState } from 'react';
import { ResourceService } from '../services/resourceItem.service';
import type { Resource } from '../types/resource';
import parseResourceBlock from '../util/parseResourceBlock';
import type { LocalBlock } from '../types/block.types';

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
export const useEditResource = (
  resource: Resource | null,
  onSuccess: () => void,
) => {
  const idHook = useState(resource?._id!);
  const [name, setNameRaw] = useState(resource?.name!);
  const [type, setType] = useState<string>(resource?.type!);
  const [price, setPrice] = useState(String(resource?.price!));
  const blocksHook = useState<LocalBlock[]>(() =>
    parseResourceBlock(resource?.content ?? []),
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const secretUrlHook = useState(resource?.resourceUrl!);
  const [coverImage, setCoverImageRaw] = useState<File | null>(null);
  const coverPreviewHook = useState(resource?.imageUrl!);
  const coverDisplayHeightHook = useState(400);
  const [emailContent, setEmailContentRaw] = useState(resource?.emailContent!);

  const [id] = idHook;
  const [blocks, setBlocks] = blocksHook;
  const [coverPreview, setCoverPreview] = coverPreviewHook;
  const [secretUrl] = secretUrlHook;

  useEffect(() => {
    if (!resource?.content) return;

    resource.content.forEach(async (block, i) => {
      if (block.type === 'image') {
        const previewUrl = block.content;
        const response = await fetch(block.content);
        const blob = await response.blob();
        const file = new File([blob], 'defaultImage.jpg', {
          type: blob.type,
        });

        setBlocks((p) =>
          p.map((b, idx) =>
            idx === i && b.kind === 'imagen'
              ? {
                  ...b,
                  file,
                  previewUrl,
                  displayHeight: 400,
                  originalString: block.content,
                }
              : b,
          ),
        );
      }
    });
  }, [resource]);

  // guard name length
  const setName = (v: string) => {
    if (v.length <= MAX_NAME_LENGTH) {
      setNameRaw(v);
      clearError('name');
    }
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
        setErrors((prev) => ({
          ...prev,
          [`block_${i}`]: `La imagen no puede superar ${MAX_FILE_SIZE_MB} MB`,
        }));
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
      setErrors((prev) => ({
        ...prev,
        coverImage: `La imagen no puede superar ${MAX_FILE_SIZE_MB} MB`,
      }));
      return;
    }
    setCoverImageRaw(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeBlock = (i: number) => {
    const newBlocks = blocks.filter((_, idx) => idx !== i);
    validateData(newBlocks);
    setBlocks(newBlocks);
  };

  const clearError = (key: string) =>
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

  function validateData(currBlocks?: LocalBlock[]) {
    setErrors({});

    // ── All sync validations first ──
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El título es requerido';
    if (name.trim().length > MAX_NAME_LENGTH)
      newErrors.name = `El título no puede superar ${MAX_NAME_LENGTH} caracteres`;

    const priceNum = parseInt(price, 10);
    if (!price || isNaN(priceNum) || priceNum <= 0)
      newErrors.price = 'Ingresa un precio válido';
    else if (priceNum > MAX_PRICE)
      newErrors.price = `El precio no puede superar ${MAX_PRICE.toLocaleString('en-US')} USD`;

    if (!secretUrl.trim())
      newErrors.secretUrl =
        type === 'manual'
          ? 'El PDF URL es requerido'
          : 'El Video URL es requerido';

    const urlRegex =
      /(?:http[s]?:\/\/.)?(?:www\.)?[-a-zA-Z0-9@%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
    if (!urlRegex.test(secretUrl)) newErrors.secretUrl = 'URL inválido';
    if (type === 'taller' && !emailContent.trim())
      newErrors.emailContent = 'El contenido del correo es requerido';

    (currBlocks ?? blocks).forEach((block, i) => {
      if (block.kind === 'texto' && !block.value.trim()) {
        newErrors[`block_${i}`] = 'El bloque de texto no puede estar vacío';
      }
      if (block.kind === 'link' && !block.value.trim()) {
        newErrors[`block_${i}`] = 'El bloque de link no puede estar vacío';
      }
      if (block.kind === 'imagen' && !block.previewUrl) {
        newErrors[`block_${i}`] = 'Debes seleccionar una imagen';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return newErrors;
    }
    return {};
  }

  // ── submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const newErrors = validateData();

    setLoading(true);
    try {
      if (Object.keys(newErrors).length > 0) {
        console.log(newErrors);
        throw newErrors;
      }
      let coverUrl = resource?.imageUrl;
      if (coverImage) coverUrl = await ResourceService.uploadImage(coverImage);

      const serialised = await Promise.all(
        blocks.map(async (block) => {
          if (block.kind === 'texto')
            return { type: 'text' as const, content: block.value }; // value → content
          if (block.kind === 'link')
            return {
              type: 'text' as const,
              content: normaliseLink(block.value),
            }; // value → content
          if (
            block.kind === 'imagen' &&
            block.file?.name != 'defaultImage.jpg'
          ) {
            const imageUrl = await ResourceService.uploadImage(block.file!);
            return { type: 'image' as const, content: imageUrl }; // value → content
          } else {
            return {
              type: 'image' as const,
              content: block.originalString ?? '',
            };
          }
        }),
      );

      const priceNum = parseInt(price, 10);
      const newObj: Partial<Resource> = {
        type,
        name: name.trim(),
        price: priceNum,
        imageUrl: coverUrl,
        content: serialised,
        ...(type.toLowerCase() === 'taller' && {
          description: name.trim(),
          resourceUrl: secretUrl.trim(),
          emailContent: emailContent.trim(),
        }),
        ...(type.toLowerCase() === 'manual' && {
          resourceUrl: secretUrl.trim(),
        }),
      };

      const changeset = Object.fromEntries(
        (
          Object.entries(newObj) as [keyof Resource, Resource[keyof Resource]][]
        ).filter(([key, value]) => {
          if (key == 'content') {
            const sortKeysDeep = (val: unknown): unknown => {
              if (Array.isArray(val)) return val.map(sortKeysDeep);
              if (val !== null && typeof val === 'object') {
                return Object.keys(val)
                  .sort()
                  .reduce(
                    (acc, k) => {
                      acc[k] = sortKeysDeep(
                        (val as Record<string, unknown>)[k],
                      );
                      return acc;
                    },
                    {} as Record<string, unknown>,
                  );
              }
              return val;
            };

            const normalize = (val: unknown) =>
              JSON.stringify(sortKeysDeep(val));

            const isEqual = normalize(resource?.[key]) === normalize(value);
            return !isEqual;
          }
          return resource?.[key] != value;
        }),
      ) as Partial<Resource>;

      if (Object.keys(changeset).length < 1) {
        setErrors((prev) => ({ ...prev, general: 'No hay cambios' }));
        return;
        // throw Error("No hay cambios")
      }

      await ResourceService.updateResource({
        _id: id,
        type: newObj.type,
        ...changeset,
      });

      onSuccess?.();
    } catch (error) {
      if (error && typeof error === 'object' && !('message' in error)) {
        // thrown validation errors object — already set via setErrors above
        return;
      }
      setErrors({ general: 'Ocurrió un error al guardar. Intenta de nuevo.' });
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
    errors,
    canAddBlock: blocks.length < MAX_BLOCKS,
    MAX_NAME_LENGTH,
    MAX_TEXT_LENGTH,
    MAX_PRICE,
    addBlock,
    updateBlocks,
    handleSubmit,
    coverPreview,
    emailHook,
    clearError,
    MAX_EMAIL_CONTENT_LENGTH,
    validateData,
  };
};
