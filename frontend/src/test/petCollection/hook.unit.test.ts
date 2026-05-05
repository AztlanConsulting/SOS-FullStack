import usePetGallery from '@/features/petCollection/hooks/usePetGallery';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import wrapper from '../utils/wrapper.util';

// Test for the petCollection hook
describe('usePetGallery hook', () => {
  const mockFile = new File([''], 'pet.png', { type: 'image/png' });
  const mockQueryFn = vi.fn().mockResolvedValue([{ id: 1, species: 'Dog' }]);
  const mockPageFn = vi.fn().mockResolvedValue(5);

  test('initializes with default values', () => {
    const { result } = renderHook(
      () => usePetGallery(mockQueryFn, mockPageFn),
      { wrapper },
    );

    expect(result.current.pages.pageHook[0]).toBe(1);
    expect(result.current.imgHook[0]).toBeNull();
    expect(result.current.vectorImages.isLoading).toBe(false);
  });

  test('updates state and triggers query when image is set', async () => {
    const { result } = renderHook(
      () => usePetGallery(mockQueryFn, mockPageFn),
      { wrapper },
    );

    // Set the image via the hook
    const [, setImage] = result.current.imgHook;
    setImage(mockFile);

    expect(result.current.imgHook[0]).toBe(mockFile);

    await waitFor(() => {
      expect(mockQueryFn).toHaveBeenCalledWith(mockFile, 1, '', undefined);
      expect(mockPageFn).toHaveBeenCalledWith(mockFile);
    });
  });

  test('resets page to 1 when a new search is performed', async () => {
    const { result } = renderHook(
      () => usePetGallery(mockQueryFn, mockPageFn),
      { wrapper },
    );

    // Manually set page to 5
    const [, setPage] = result.current.pages.pageHook;
    setPage(5);

    // Trigger search
    result.current.handleSearch('Golden Retriever');

    expect(result.current.pages.pageHook[0]).toBe(1);
  });
});
