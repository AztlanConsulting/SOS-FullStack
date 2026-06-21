import { useEditResource } from '@/features/resources/hooks/useEditResource';
import { ResourceService } from '@/features/resources/services/resourceItem.service';
import type { Resource } from '@/features/resources/types/resource';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock Dependecies
vi.mock('@/features/resources/services/resourceItem.service', () => ({
  ResourceService: {
    uploadImage: vi.fn(),
    updateResource: vi.fn(),
  },
}));

vi.mock('../util/parseResourceBlock', () => ({
  default: vi.fn((content) => {
    if (!content) return [];
    return content.map((c: any) => ({
      kind: c.type === 'text' ? 'texto' : 'imagen',
      value: c.type === 'text' ? c.content : '',
      file: null,
      previewUrl: c.type === 'image' ? c.content : '',
      displayHeight: 400,
    }));
  }),
}));

// 2. Global Mocking for Browser APIs
global.URL.createObjectURL = vi.fn(() => 'mock-blob-url');

const mockResource = {
  _id: '123',
  name: 'Initial Name',
  description: 'Initial Name',
  type: 'taller',
  price: 50,
  resourceUrl: 'https://video.url',
  imageUrl: 'https://cover.jpg',
  emailContent: 'Initial Email Content',
  content: [{ type: 'text', content: 'Hello World' }],
};

describe('useEditResource Hook', () => {
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock global fetch for the internal loop inside the hook
    global.fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(new Blob([''], { type: 'image/jpeg' })),
    });
  });

  // ── Initialization Tests ───────────────────────────────────────────────────
  it('should initialize state correctly with provided resource values', () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );

    expect(result.current.nameHook[0]).toBe('Initial Name');
    expect(result.current.typeHook[0]).toBe('taller');
    expect(result.current.priceHook[0]).toBe('50');
    expect(result.current.coverPreview).toBe('https://cover.jpg');
    expect(result.current.emailHook[0]).toBe('Initial Email Content');
  });

  // ── Validation & Guard Tests ───────────────────────────────────────────────
  it('should enforce MAX_NAME_LENGTH constraint', () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );
    const [, setName] = result.current.nameHook;

    const longName = 'a'.repeat(101); // Max is 100
    act(() => {
      setName(longName);
    });

    // Should reject change and keep original
    expect(result.current.nameHook[0]).toBe('Initial Name');
  });

  it('should update name when length is valid', () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );
    const [, setName] = result.current.nameHook;

    act(() => {
      setName('Valid New Name');
    });

    expect(result.current.nameHook[0]).toBe('Valid New Name');
  });

  // ── Block Helper Tests ──────────────────────────────────────────────────────
  it('should add content blocks until reaching MAX_BLOCKS', () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );

    expect(result.current.blocks.length).toBe(1);

    act(() => {
      result.current.addBlock('texto');
    });

    expect(result.current.blocks.length).toBe(2);
    expect(result.current.blocks[1]).toEqual({ kind: 'texto', value: '' });
  });

  it('should remove an active block correctly', () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );

    act(() => {
      result.current.updateBlocks.removeBlock(0);
    });

    expect(result.current.blocks.length).toBe(0);
  });

  it('should validate file sizes when updating image block', () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );

    // 6MB file (exceeds MAX_FILE_SIZE_MB = 5)
    const largeFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    act(() => {
      result.current.updateBlocks.updateImageBlock(0, largeFile);
    });

    expect(result.current.errors).toStrictEqual({
      block_0: 'La imagen no puede superar 5 MB',
    });
  });

  // ── Form Submission Tests ───────────────────────────────────────────────────
  it('should validate missing title fields upon submit', async () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );
    const [, setName] = result.current.nameHook;

    act(() => {
      setName(''); // Clear name
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors).toStrictEqual({
      name: 'El título es requerido',
    });
    expect(ResourceService.updateResource).not.toHaveBeenCalled();
  });

  it('should validate invalid prices upon submit', async () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );
    const [, setPrice] = result.current.priceHook;

    act(() => {
      setPrice('-10');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors).toStrictEqual({
      price: 'Ingresa un precio válido',
    });
  });

  it('should call updateResource service and trigger onSuccess hook on a successful patch submit', async () => {
    vi.mocked(ResourceService.updateResource).mockResolvedValue(true);

    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );

    // Manually update a field so a difference is generated in the changeset
    const [, setName] = result.current.nameHook;
    act(() => {
      setName('A Brand New Unique Name');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(ResourceService.updateResource).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalled();
    expect(result.current.errors).toStrictEqual({});
  });

  it('should block submit and set error if no changes were made', async () => {
    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );

    // Allow the hook's internal image hydration useEffect loop to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Now submit without modifying any state hook values
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(ResourceService.updateResource).not.toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
    expect(result.current.errors).toStrictEqual({ general: 'No hay cambios' });
  });

  it('should catch service failures safely and provide user feedback error', async () => {
    vi.mocked(ResourceService.updateResource).mockRejectedValue(
      new Error('Network Error'),
    );

    const { result } = renderHook(() =>
      useEditResource(mockResource, onSuccessMock),
    );

    const [, setName] = result.current.nameHook;
    act(() => {
      setName('A Brand New Unique Name');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors).toStrictEqual({
      general: 'Ocurrió un error al guardar. Intenta de nuevo.',
    });
    expect(onSuccessMock).not.toHaveBeenCalled();
  });
});
