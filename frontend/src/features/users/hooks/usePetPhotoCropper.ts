import { useCallback, useEffect, useMemo, useState } from 'react';

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropPosition = {
  x: number;
  y: number;
};

const POSTER_SLOT_ASPECT_RATIOS: Record<
  1 | 2 | 3 | 4,
  Record<number, number>
> = {
  1: { 1: 17 / 11 },
  2: { 1: 17 / 22, 2: 17 / 22 },
  3: { 1: 17 / 11, 2: 17 / 11, 3: 17 / 22 },
  4: { 1: 17 / 11, 2: 17 / 11, 3: 17 / 11, 4: 17 / 11 },
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedFile = async (
  imageSrc: string,
  pixelCrop: CropArea,
  fileName: string,
  mimeType: string,
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No canvas context available');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Unable to create cropped image'));
        }
      },
      mimeType || 'image/jpeg',
      0.95,
    );
  });

  return new File([blob], fileName, {
    type: blob.type || mimeType || 'image/jpeg',
  });
};

export const usePetPhotoCropper = (
  photoCount: 1 | 2 | 3 | 4,
  onSaveCroppedImage: (index: number, file: File) => void,
) => {
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  const [cropPosition, setCropPosition] = useState<CropPosition>({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState<CropArea | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSavingCrop, setIsSavingCrop] = useState(false);

  const cropAspectRatio = useMemo(() => {
    if (!selectedIndex) {
      return 1;
    }

    return (
      POSTER_SLOT_ASPECT_RATIOS[photoCount]?.[selectedIndex] ??
      POSTER_SLOT_ASPECT_RATIOS[photoCount]?.[1] ??
      1
    );
  }, [photoCount, selectedIndex]);

  const closeCropper = useCallback(() => {
    if (cropImageUrl) {
      URL.revokeObjectURL(cropImageUrl);
    }

    setCropOpen(false);
    setCropImageUrl(null);
    setCropPosition({ x: 0, y: 0 });
    setZoom(1);
    setCropAreaPixels(null);
    setSelectedFile(null);
    setSelectedIndex(null);
    setIsSavingCrop(false);
  }, [cropImageUrl]);

  useEffect(() => {
    return () => {
      if (cropImageUrl) {
        URL.revokeObjectURL(cropImageUrl);
      }
    };
  }, [cropImageUrl]);

  const openCropper = useCallback(
    (index: number, file: File) => {
      if (cropImageUrl) {
        URL.revokeObjectURL(cropImageUrl);
      }

      setSelectedIndex(index);
      setSelectedFile(file);
      setCropImageUrl(URL.createObjectURL(file));
      setCropOpen(true);
      setCropPosition({ x: 0, y: 0 });
      setZoom(1);
      setCropAreaPixels(null);
    },
    [cropImageUrl],
  );

  const handleFileSelection = useCallback(
    (
      index: number,
      file: File | null,
      onClear?: (slotIndex: number) => void,
    ) => {
      if (!file) {
        onClear?.(index);
        return;
      }

      openCropper(index, file);
    },
    [openCropper],
  );

  const handleCropComplete = useCallback(
    (_: CropArea, croppedPixels: CropArea) => {
      setCropAreaPixels(croppedPixels);
    },
    [],
  );

  const handleCropSave = useCallback(async () => {
    if (!cropImageUrl || !cropAreaPixels || !selectedFile || !selectedIndex) {
      return;
    }

    setIsSavingCrop(true);

    try {
      const extension = selectedFile.name.split('.').pop();
      const baseName = selectedFile.name.replace(/\.[^.]+$/, '');
      const mimeType = selectedFile.type || 'image/jpeg';
      const croppedFile = await getCroppedFile(
        cropImageUrl,
        cropAreaPixels,
        `${baseName}-cropped${extension ? `.${extension}` : ''}`,
        mimeType,
      );

      onSaveCroppedImage(selectedIndex, croppedFile);
      closeCropper();
    } catch (error) {
      console.error('Error cropping image:', error);
      setIsSavingCrop(false);
    }
  }, [
    closeCropper,
    cropAreaPixels,
    cropImageUrl,
    onSaveCroppedImage,
    selectedFile,
    selectedIndex,
  ]);

  return {
    cropOpen,
    cropImageUrl,
    cropPosition,
    cropAspectRatio,
    zoom,
    cropAreaPixels,
    selectedIndex,
    isSavingCrop,
    setCropPosition,
    setZoom,
    handleFileSelection,
    handleCropComplete,
    handleCropSave,
    closeCropper,
  };
};
