import type { ContentBlock } from '@/shared/types/content.types';
import type { LocalBlock } from '../hooks/useEditResource';

function parseResourceBlock(resourceBlock: ContentBlock[]): LocalBlock[] {
  return resourceBlock.map(
    (r) => ({ kind: r.type, value: r.content }) as LocalBlock,
  );
}

export default parseResourceBlock;
