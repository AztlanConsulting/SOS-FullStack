import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> => {
  const image = await createImage(imageSrc);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No canvas context');

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

  return canvas.toDataURL('image/jpeg');
};

const ImageCropper: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropImage = async () => {
    if (!image || !croppedAreaPixels) return;

    try {
      const croppedImg = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(croppedImg);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setImage(imageUrl);
            setCroppedImage(null);
          }
        }}
        className="mb-4"
      />

      {/* Cropper */}
      {image && (
        <>
          <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={4 / 5}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom Slider */}
          <div className="mt-4">
            <label className="block mb-2 font-medium">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Crop Button */}
          <button
            onClick={handleCropImage}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Crop Image
          </button>
        </>
      )}

      {/* Preview */}
      {croppedImage && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Cropped Preview</h2>
          <img src={croppedImage} alt="Cropped" className="rounded-lg border" />
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
