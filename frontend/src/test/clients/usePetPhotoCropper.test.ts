import { act, renderHook } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';
import { usePetPhotoCropper } from '@/features/users/hooks/usePetPhotoCropper';

const makeFile = (name: string) =>
  new File(['content'], name, { type: 'image/jpeg' });

const MOCK_CROPPED_BLOB = new Blob(['cropped'], { type: 'image/jpeg' });

describe('usePetPhotoCropper', () => {
  const originalImage = globalThis.Image;
  const originalCreateElement = document.createElement.bind(document);
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    vi.restoreAllMocks();

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:pet-photo'),
      writable: true,
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
      writable: true,
    });

    const drawImage = vi.fn();
    const toBlob = vi.fn((callback: BlobCallback) =>
      callback(MOCK_CROPPED_BLOB),
    );

    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return {
          getContext: vi.fn(() => ({ drawImage })),
          height: 0,
          toBlob,
          width: 0,
        } as unknown as HTMLCanvasElement;
      }

      return originalCreateElement(tagName);
    });

    class MockImage {
      private listeners: Record<string, Array<() => void>> = {};

      addEventListener(event: string, callback: () => void) {
        this.listeners[event] ??= [];
        this.listeners[event].push(callback);
      }

      set src(_value: string) {
        this.listeners.load?.forEach((callback) => callback());
      }
    }

    Object.defineProperty(globalThis, 'Image', {
      configurable: true,
      value: MockImage,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'Image', {
      configurable: true,
      value: originalImage,
      writable: true,
    });

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: originalCreateObjectURL,
      writable: true,
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: originalRevokeObjectURL,
      writable: true,
    });
  });

  test('opens the cropper and computes the expected aspect ratio', async () => {
    const { result } = renderHook(() => usePetPhotoCropper(3, vi.fn()));

    await act(async () => {
      await result.current.handleFileSelection(3, makeFile('photo.jpg'));
    });

    expect(result.current.cropOpen).toBe(true);
    expect(result.current.cropImageUrl).toBe('blob:pet-photo');
    expect(result.current.selectedIndex).toBe(3);
    expect(result.current.zoom).toBe(1);
    expect(result.current.cropAspectRatio).toBeCloseTo(17 / 22);
  });

  test('calls onClear when no file is selected', async () => {
    const onClear = vi.fn();

    const { result } = renderHook(() => usePetPhotoCropper(3, vi.fn()));

    await act(async () => {
      await result.current.handleFileSelection(2, null, onClear);
    });

    expect(onClear).toHaveBeenCalledWith(2);
    expect(result.current.cropOpen).toBe(false);
  });

  test('saves the cropped file and closes the cropper', async () => {
    const onSaveCroppedImage = vi.fn();
    const { result } = renderHook(() =>
      usePetPhotoCropper(4, onSaveCroppedImage),
    );

    await act(async () => {
      await result.current.handleFileSelection(1, makeFile('pet.jpg'));
      result.current.handleCropComplete(
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 10, y: 20, width: 200, height: 150 },
      );
    });

    await act(async () => {
      await result.current.handleCropSave();
    });

    expect(onSaveCroppedImage).toHaveBeenCalledTimes(1);

    const [savedIndex, savedFile] = onSaveCroppedImage.mock.calls[0];
    expect(savedIndex).toBe(1);
    expect(savedFile).toBeInstanceOf(File);
    expect(savedFile.name).toBe('pet-cropped.jpg');
    expect(savedFile.type).toBe('image/jpeg');
    expect(result.current.cropOpen).toBe(false);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:pet-photo');
  });

  test('revokes the preview URL when the hook unmounts', async () => {
    const { result, unmount } = renderHook(() =>
      usePetPhotoCropper(2, vi.fn()),
    );

    await act(async () => {
      await result.current.handleFileSelection(1, makeFile('pet.jpg'));
    });

    unmount();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:pet-photo');
  });
});
