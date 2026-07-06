import type { ContentBlock } from '@/shared/types/content.types';
import type { LocalBlock } from '../types/block.types';

function parseResourceBlock(resourceBlock: ContentBlock[]): LocalBlock[] {
  const newResources = resourceBlock.map(
    (r) => ({ kind: getType(r), value: r.content }) as LocalBlock,
  );

  return newResources;
}

function getType(resource: ContentBlock): string {
  const regex = /^http/;
  const types: Record<string, string> = {
    text: 'texto',
    image: 'imagen',
  };

  if (regex.test(resource.content) && resource.type == 'text') return 'link';
  return types[resource.type];
}

export default parseResourceBlock;
