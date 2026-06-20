import type { LocalBlock } from '@/features/resources/types/block.types';
import { Text } from '@/shared/components/ui';
import ContentImageBlock from '@/shared/components/ui/ContentImageBlock';
import ContentTextBlock from '@/shared/components/ui/ContentTextBlock';
import { useState } from 'react';
import type { BlogElement } from '../types/blog.types';

interface Props extends BlogElement {
  blocks: LocalBlock[];
  updateBlocks: {
    updateTextBlock: (idx: number, val: string) => void;
    updateImageBlock: (idx: number, file: File) => void;
  };
  handleBlocks: {
    addBlock: (kind: LocalBlock['kind']) => void;
    removeBlock: (idx: number) => void;
  };
}

const FIELD_CLASS =
  'w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none  bg-white';

const BlogContent = ({ edit, blocks, updateBlocks, handleBlocks }: Props) => {
  const { updateTextBlock, updateImageBlock } = updateBlocks;

  const [canAddBlock, setCanAddBlock] = useState(blocks.length < 10);
  const { addBlock, removeBlock } = handleBlocks;

  const handleAddBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as LocalBlock['kind'];
    if (!val) return;
    addBlock(val);
    e.target.value = '';
  };

  return (
    <section className="flex flex-col gap-3">
      <Text variant="small" color="text-gray-500">
        Contenido
      </Text>

      {blocks.map((block, idx) => {
        switch (block.kind) {
          case 'texto':
            return (
              <ContentTextBlock
                key={idx}
                edit={edit}
                value={block.value}
                onChange={(value) => updateTextBlock(idx, value)}
                onDelete={() => removeBlock(idx)}
              />
            );
          case 'imagen':
            return (
              <ContentImageBlock
                key={idx}
                edit={edit}
                previewUrl={block.previewUrl}
                onChange={(file) => updateImageBlock(idx, file)}
                onDelete={() => removeBlock(idx)}
              />
            );
        }
      })}

      {/* ── Add block dropdown ── */}
      {edit &&
        (canAddBlock ? (
          <div className="relative mt-4">
            <select
              id="create-box"
              defaultValue=""
              onChange={handleAddBlock}
              className={
                FIELD_CLASS + ' appearance-none text-gray-500 !text-sm'
              }
            >
              <option value="" disabled>
                Selecciona el bloque de contenido que quisieras insertar
              </option>
              <option value="imagen">Imagen </option>
              <option value="texto">Texto</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▼
            </span>
          </div>
        ) : (
          <Text variant="small" color="text-gray-400" className="text-center">
            Máximo de 10 bloques alcanzado
          </Text>
        ))}
    </section>
  );
};

export default BlogContent;
