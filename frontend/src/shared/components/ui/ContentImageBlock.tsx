import { useRef } from 'react';
import { HiPhotograph, HiTrash } from 'react-icons/hi';
import { Text } from './Text';
import { Button } from './Button';

interface Props {
  previewUrl?: string;
  onChange: (file: File) => void;
  onDelete: () => void;
}

const ContentImageBlock = ({ previewUrl, onChange, onDelete }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative border border-gray-200 rounded-md p-3">
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        <HiTrash size={15} />
      </button>

      <div className="flex items-center gap-1 mb-2">
        <HiPhotograph size={13} className="text-gray-400" />
        <Text variant="small" color="text-gray-400">
          Imagen
        </Text>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />

      {previewUrl ? (
        <div className="flex flex-col gap-2">
          <img
            src={previewUrl}
            alt=""
            className="w-full rounded-md object-cover"
          />

          <Button
            variant="toolbar"
            label="Cambiar imagen"
            icon={HiPhotograph}
            onClick={() => inputRef.current?.click()}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-md py-8 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors flex flex-col items-center gap-2"
        >
          <HiPhotograph size={24} />
          <Text variant="small" color="text-inherit">
            Seleccionar imagen
          </Text>
        </button>
      )}
    </div>
  );
};

export default ContentImageBlock;
