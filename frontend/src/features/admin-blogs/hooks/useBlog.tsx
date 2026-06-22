import type { Blog } from '@/features/blog/types/blog.types';
import type { LocalBlock } from '@/features/resources/types/block.types';
import parseResourceBlock from '@/features/resources/util/parseResourceBlock';
import {
  MAX_BLOCKS,
  MAX_FILE_SIZE_MB,
  MAX_NAME_LENGTH,
  MAX_TEXT_LENGTH,
} from '@/features/resources/hooks/useEditResource';
import { useState } from 'react';
import useUpdateContentImage from '@/shared/hooks/updateConentImage';
import updateBlog from './updateBlog';
import registerBlog from './registerBlog';

function useBlog(blog?: Blog | undefined, onSuccess?: () => void) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [blogChangeset, setBlogChangeset] = useState<Blog>(
    blog ?? {
      name: '',
      duration: 0,
      content: [],
      active: true,
      imageUrl: '',
    },
  );

  const coverImageHook = useState<File | null>(null);
  const [coverImage, setCoverImage] = coverImageHook;
  const coverPreviewHook = useState(blog?.imageUrl ?? '');
  const [coverPreview, setCoverPreview] = coverPreviewHook;

  const blockHookRaw = useState<LocalBlock[]>(() =>
    parseResourceBlock(blog?.content ?? []),
  );
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = blockHookRaw;

  const blocksHook = { blocks, setBlocks };

  useUpdateContentImage<Blog>(blog, blockHookRaw[1]);

  function addBlock(kind: LocalBlock['kind']) {
    if (blocks.length >= MAX_BLOCKS) return;
    if (kind === 'texto')
      setBlocks((p) => [...p, { kind: 'texto', value: '' }]);
    if (kind === 'link') setBlocks((p) => [...p, { kind: 'link', value: '' }]);
    if (kind === 'imagen')
      setBlocks((p) => [
        ...p,
        { kind: 'imagen', file: null, previewUrl: '', displayHeight: 128 },
      ]);
  }
  function removeBlock(i: number) {
    const newBlocks = blocks.filter((_, idx) => idx !== i);
    validateData(newBlocks);
    setBlocks(newBlocks);
  }

  function validateData(currBlocks?: LocalBlock[]) {
    setErrors({});

    // ── All sync validations first ──
    const newErrors: Record<string, string> = {};

    const title = blogChangeset.name;
    if (!title.trim()) newErrors.name = 'El título es requerido';
    if (title.trim().length > MAX_NAME_LENGTH)
      newErrors.name = `El título no puede superar ${MAX_NAME_LENGTH} caracteres`;

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

  function updateCoverImage(file: File) {
    const sizeMB = file.size / (1024 * 1024);

    if (sizeMB > MAX_FILE_SIZE_MB) {
      setErrors((prev) => ({
        ...prev,
        coverImage: `La imagen no puede superar ${MAX_FILE_SIZE_MB} MB`,
      }));
      return;
    }

    setErrors((prev) => {
      const { coverImage, ...rest } = prev;
      return rest;
    });

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  const updateTextBlock = (i: number, value: string) => {
    if (value.length > MAX_TEXT_LENGTH) return;
    setBlocks((p) =>
      p.map((b, idx) =>
        idx === i && b.kind === 'texto' ? { ...b, value } : b,
      ),
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

  const dependencies = { blog: blogChangeset, coverImage, blocks, setErrors };

  async function save() {
    const newErrors = validateData();
    setLoading(true);
    if (blog) {
      updateBlog(dependencies, newErrors, onSuccess);
    } else {
      registerBlog(dependencies, newErrors, onSuccess);
    }
    setLoading(false);
  }

  const updateBlocks = {
    updateTextBlock,
    updateImageBlock,
  };

  const handleBlocks = { addBlock, removeBlock };
  return {
    blocksHook,
    blogChangeset,
    setBlogChangeset,
    handleBlocks,
    loading,
    updateBlocks,
    coverImageHook,
    coverPreview,
    updateCoverImage,
    validateData,
    errors,
    save,
  };
}

export default useBlog;
