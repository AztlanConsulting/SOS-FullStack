import ReactCrop from 'react-easy-crop';
import { Button } from '@/shared/components/ui/Button';
import { Text } from '@/shared/components/ui/Text';

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

export interface PetPhotoCropperModalProps {
  open: boolean;
  imageUrl: string | null;
  selectedIndex: number | null;
  cropPosition: CropPosition;
  zoom: number;
  cropAspectRatio: number;
  isSaving: boolean;
  onClose: () => void;
  onCropChange: (position: CropPosition) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (_: CropArea, croppedPixels: CropArea) => void;
  onSave: () => void;
}

export const PetPhotoCropperModal = ({
  open,
  imageUrl,
  selectedIndex,
  cropPosition,
  zoom,
  cropAspectRatio,
  isSaving,
  onClose,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onSave,
}: PetPhotoCropperModalProps) => {
  if (!open || !imageUrl || !selectedIndex) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 py-6">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl color-grey-border">
        <div className="color-primary-bg px-5 py-4 rounded-t-lg flex items-center justify-between border-b-2 color-grey-border">
          <Text
            variant="body"
            weight="medium"
            className="text-white flex-1 text-center"
          >
            Recorta la foto {selectedIndex}
          </Text>
        </div>
        <div className="px-5 md:max-w-lg md:px-0 mx-auto">
          <Text variant="body" className="my-3">
            El recorte se ajusta al formato del póster para esta posición.
          </Text>

          <div className="relative h-[45vh] w-full overflow-hidden rounded-lg bg-black">
            <ReactCrop
              image={imageUrl}
              crop={cropPosition}
              zoom={zoom}
              minZoom={1}
              maxZoom={4}
              aspect={cropAspectRatio}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropComplete}
              objectFit="contain"
              restrictPosition
              showGrid={false}
            />
          </div>

          <div className="mt-3 space-y-3">
            <Text variant="caption" as="p" weight="medium">
              Zoom
            </Text>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(event) => onZoomChange(Number(event.target.value))}
              className="w-full accent-[var(--color-primary)] "
              disabled={isSaving}
            />
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-3 mt-3 mb-5">
            <Button
              variant="primary"
              onClick={onSave}
              disabled={isSaving}
              label={isSaving ? 'Guardando...' : 'Guardar'}
            />
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSaving}
              label="Cancelar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
