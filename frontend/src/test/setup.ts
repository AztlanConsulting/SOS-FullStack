import { vi } from 'vitest';

vi.mock('heic2any', () => ({
  default: async ({ blob }: { blob: Blob }) => blob,
}));
