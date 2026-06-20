import type { LocalBlock } from '@/features/resources/types/block.types';
import { Text } from '@/shared/components/ui';
import ContentImageBlock from '@/shared/components/ui/ContentImageBlock';
import ContentTextBlock from '@/shared/components/ui/ContentTextBlock';

interface Props {
  blocks: LocalBlock[];
  updateBlocks: {
    updateTextBlock: (idx: number, val: string) => void;
    updateImageBlock: (idx: number, file: File) => void;
  };
  handleBlocks: {
    handleAddBlock: () => void;
    removeBlock: (idx: number) => void;
  };
}

const BlogContent = ({ blocks, updateBlocks, handleBlocks }: Props) => {
  const { updateTextBlock, updateImageBlock } = updateBlocks;
  const { handleAddBlock, removeBlock } = handleBlocks;

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
                value={block.value}
                onChange={(value) => updateTextBlock(idx, value)}
                onDelete={() => removeBlock(idx)}
              />
            );
          case 'imagen':
            <ContentImageBlock
              key={idx}
              previewUrl={block.previewUrl}
              onChange={(file) => updateImageBlock(idx, file)}
              onDelete={() => removeBlock(idx)}
            />;
        }
      })}

      <select
        defaultValue=""
        onChange={handleAddBlock}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Agregar bloque
        </option>

        <option value="texto">Texto</option>
        <option value="imagen">Imagen</option>
      </select>
    </section>
  );
};

export default BlogContent;
