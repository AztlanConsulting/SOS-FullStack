import usePetGallery from '@/features/petCollection/hooks/usePetGallery';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import wrapper from '../utils/wrapper.util';
import { act } from 'react';

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
    act(() => {
      const [, setImage] = result.current.imgHook;
      setImage(mockFile);
    });

    await expect(result.current.imgHook[0]).toBe(mockFile);

    await waitFor(() => {
      // Use expect.any(Object) or the specific object shape
      expect(mockQueryFn).toHaveBeenCalledWith(
        mockFile,
        1,
        expect.objectContaining({
          color: '',
          location: '',
          species: '',
        }),
      );
      expect(mockPageFn).toHaveBeenCalledWith(
        mockFile,
        expect.objectContaining({
          color: '',
          location: '',
          species: '',
        }),
      );
    });
  });

  test('updates state and triggers filter changes', async () => {
    const { result } = renderHook(
      () => usePetGallery(mockQueryFn, mockPageFn),
      { wrapper },
    );

    // Set the image via the hook
    act(() => {
      const [, setImage] = result.current.imgHook;
      setImage(mockFile);
      const handleSearch = result.current.handleSearch;
      handleSearch('color', 'brown');
      handleSearch('location', 'qro');
      handleSearch('species', 'pug');
    });

    await expect(result.current.imgHook[0]).toBe(mockFile);

    await waitFor(() => {
      // Use expect.any(Object) or the specific object shape
      expect(mockQueryFn).toHaveBeenCalledWith(
        mockFile,
        1,
        expect.objectContaining({
          color: 'brown',
          location: 'qro',
          species: 'pug',
        }),
      );
      expect(mockPageFn).toHaveBeenCalledWith(
        mockFile,
        expect.objectContaining({
          color: 'brown',
          location: 'qro',
          species: 'pug',
        }),
      );
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
    result.current.handleSearch('color', 'gray');

    expect(result.current.pages.pageHook[0]).toBe(1);
  });
});
