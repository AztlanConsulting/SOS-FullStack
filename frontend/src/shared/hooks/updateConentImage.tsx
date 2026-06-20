import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { ContentBlock } from '../types/content.types';
import type { LocalBlock } from './useCreateResource';

interface DefaultItem {
  content: ContentBlock[];
}

function useUpdateContentImage<T extends DefaultItem>(
  item: T | undefined,
  setItem: Dispatch<SetStateAction<LocalBlock[]>>,
) {
  useEffect(() => {
    if (item == undefined) return;
    if (!item?.content) return;

    item.content.forEach(async (block, i) => {
      if (block.type === 'image') {
        const previewUrl = block.content;
        const response = await fetch(block.content);
        const blob = await response.blob();
        const file = new File([blob], 'defaultImage.jpg', {
          type: blob.type,
        });

        setItem((p) =>
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
  }, [item]);
}

export default useUpdateContentImage;
