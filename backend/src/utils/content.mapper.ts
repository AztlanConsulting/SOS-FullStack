export type ContentBlock = {
  content: string;
  type: string;
};

/**
 * Normalizes raw content into a valid ContentBlock array.
 *
 * @param rawContent - Content from database (string, array, or unknown)
 * @returns Array of valid ContentBlock
 */
export function normalizeContent(rawContent: unknown): ContentBlock[] {
  if (Array.isArray(rawContent)) {
    return rawContent.filter(
      (block): block is ContentBlock =>
        typeof block === 'object' &&
        block !== null &&
        'content' in block &&
        'type' in block &&
        typeof (block as { content: unknown }).content === 'string' &&
        typeof (block as { type: unknown }).type === 'string',
    );
  }

  if (typeof rawContent === 'string') {
    return [{ content: rawContent, type: 'text' }];
  }

  return [];
}
