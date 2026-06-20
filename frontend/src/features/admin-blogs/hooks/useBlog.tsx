import type { Blog } from '@/features/blog/types/blog.types';
import type { LocalBlock } from '@/features/resources/types/block.types';
import parseResourceBlock from '@/features/resources/util/parseResourceBlock';
import { MAX_BLOCKS } from '@/features/resources/hooks/useEditResource';
import { useState } from 'react';
import useUpdateContentImage from '@/shared/hooks/updateConentImage';

function useBlog(blog?: Blog | undefined) {
  const statusHook = useState(blog?.active ?? true);

  const blockHookRaw = useState<LocalBlock[]>(() =>
    parseResourceBlock(blog?.content ?? []),
  );
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

  function validateData(blocks: LocalBlock[]) {}

  const handleBlocks = { addBlock, removeBlock };
  return { blocksHook, statusHook, handleBlocks };
}

export default useBlog;
