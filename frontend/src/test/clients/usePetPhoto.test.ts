import { renderHook, act } from '@testing-library/react';
import { usePetPhotos } from '@/shared/hooks/usePetPhotos';
import type { Mock } from 'vitest';
import { describe, test, expect, vi, beforeEach } from 'vitest';

const makeFile = (name: string): File =>
  new File(['content'], name, { type: 'image/jpeg' });

describe('usePetPhotos hook', () => {
  let updateForm: Mock;

  beforeEach(() => {
    updateForm = vi.fn();
  });

  test('default photoCount is 3 when imageLayout is not provided', () => {
    const { result } = renderHook(() => usePetPhotos({}, updateForm));
    expect(result.current.photoCount).toBe(3);
  });

  test('photoCount matches the imageLayout value', () => {
    const { result } = renderHook(() =>
      usePetPhotos({ imageLayout: '2' }, updateForm),
    );
    expect(result.current.photoCount).toBe(2);
  });

  test('fileUploadSlots has the correct number of slots', () => {
    const { result } = renderHook(() =>
      usePetPhotos({ imageLayout: '4' }, updateForm),
    );
    expect(result.current.fileUploadSlots).toHaveLength(4);
  });

  test('fileUploadSlots contains sequential numbers starting at 1', () => {
    const { result } = renderHook(() =>
      usePetPhotos({ imageLayout: '3' }, updateForm),
    );
    expect(result.current.fileUploadSlots).toEqual([1, 2, 3]);
  });

  test('handleFileUpload adds a file at the correct index (slot 1 → index 0)', () => {
    const file = makeFile('foto.jpg');
    const { result } = renderHook(() =>
      usePetPhotos({ images: [], imageLayout: '3' }, updateForm),
    );

    act(() => {
      result.current.handleFileUpload(1, file);
    });

    expect(updateForm).toHaveBeenCalledWith(
      expect.objectContaining({ images: [file] }),
    );
  });

  test('handleFileUpload places a file at slot 2 (index 1)', () => {
    const existing = makeFile('foto1.jpg');
    const newFile = makeFile('foto2.jpg');

    const { result } = renderHook(() =>
      usePetPhotos({ images: [existing], imageLayout: '3' }, updateForm),
    );

    act(() => {
      result.current.handleFileUpload(2, newFile);
    });

    const { images } = updateForm.mock.calls[0][0];
    expect(images[1]).toBe(newFile);
  });

  test('handleFileUpload replaces a file at an existing slot', () => {
    const original = makeFile('original.jpg');
    const replacement = makeFile('reemplazo.jpg');

    const { result } = renderHook(() =>
      usePetPhotos({ images: [original], imageLayout: '3' }, updateForm),
    );

    act(() => {
      result.current.handleFileUpload(1, replacement);
    });

    const { images } = updateForm.mock.calls[0][0];
    expect(images[0]).toBe(replacement);
  });

  test('handleFileUpload removes a file when null is passed', () => {
    const file1 = makeFile('foto1.jpg');
    const file2 = makeFile('foto2.jpg');

    const { result } = renderHook(() =>
      usePetPhotos({ images: [file1, file2], imageLayout: '3' }, updateForm),
    );

    act(() => {
      result.current.handleFileUpload(1, null);
    });

    const { images } = updateForm.mock.calls[0][0];
    expect(images).toHaveLength(1);
    expect(images[0]).toBe(file2);
  });

  test('handleFileUpload removes the correct file when null is passed for slot 2', () => {
    const file1 = makeFile('foto1.jpg');
    const file2 = makeFile('foto2.jpg');
    const file3 = makeFile('foto3.jpg');

    const { result } = renderHook(() =>
      usePetPhotos(
        { images: [file1, file2, file3], imageLayout: '3' },
        updateForm,
      ),
    );

    act(() => {
      result.current.handleFileUpload(2, null);
    });

    const { images } = updateForm.mock.calls[0][0];
    expect(images).toHaveLength(2);
    expect(images[0]).toBe(file1);
    expect(images[1]).toBe(file3);
  });

  test('trims images to photoCount when uploading would exceed the limit', () => {
    const file1 = makeFile('foto1.jpg');
    const file2 = makeFile('foto2.jpg');
    const file3 = makeFile('foto3.jpg');
    const newFile = makeFile('nueva.jpg');

    const { result } = renderHook(() =>
      usePetPhotos(
        { images: [file1, file2, file3], imageLayout: '1' },
        updateForm,
      ),
    );

    act(() => {
      result.current.handleFileUpload(1, newFile);
    });

    const { images } = updateForm.mock.calls[0][0];
    expect(images).toHaveLength(1);
    expect(images[0]).toBe(newFile);
  });

  test('trims existing images when photoCount decreases via imageLayout change', () => {
    const file1 = makeFile('foto1.jpg');
    const file2 = makeFile('foto2.jpg');
    const file3 = makeFile('foto3.jpg');

    const { rerender } = renderHook(
      ({ formData }: { formData: Parameters<typeof usePetPhotos>[0] }) =>
        usePetPhotos(formData, updateForm),
      {
        initialProps: {
          formData: { images: [file1, file2, file3], imageLayout: '3' },
        },
      },
    );

    rerender({
      formData: { images: [file1, file2, file3], imageLayout: '1' },
    });

    const lastCall = updateForm.mock.calls[updateForm.mock.calls.length - 1];
    expect(lastCall[0].images).toHaveLength(1);
    expect(lastCall[0].images[0]).toBe(file1);
  });

  test('does not call updateForm when images do not exceed the new photoCount', () => {
    const file1 = makeFile('foto1.jpg');

    const { rerender } = renderHook(
      ({ formData }: { formData: Parameters<typeof usePetPhotos>[0] }) =>
        usePetPhotos(formData, updateForm),
      {
        initialProps: {
          formData: { images: [file1], imageLayout: '3' },
        },
      },
    );

    rerender({ formData: { images: [file1], imageLayout: '3' } });

    expect(updateForm).not.toHaveBeenCalled();
  });
});
