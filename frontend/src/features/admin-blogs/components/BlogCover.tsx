import { Button, Text } from '@/shared/components/ui';
import { HiPhotograph } from 'react-icons/hi';
import type { BlogElement } from '../types/blog.types';
import { useRef } from 'react';

interface Props extends BlogElement {
  coverPreview?: string;
  changeImage: (file: File) => void;
}

const BlogCover = ({ edit, coverPreview, changeImage }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="flex flex-col gap-2">
      <Text variant="small" color="text-gray-500">
        Imagen de portada
      </Text>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) changeImage(file);
        }}
      />

      {coverPreview ? (
        <div className="flex flex-col gap-2">
          <img
            src={coverPreview}
            alt="portada"
            className="w-full rounded-md object-cover"
          />

          {edit && (
            <Button
              variant="toolbar"
              label="Cambiar portada"
              icon={HiPhotograph}
              onClick={() => inputRef.current?.click()}
            />
          )}
        </div>
      ) : (
        edit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-md py-6 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors flex flex-col items-center gap-1"
          >
            <HiPhotograph size={22} />
            <Text variant="small" color="text-inherit">
              Seleccionar imagen de portada
            </Text>
          </button>
        )
      )}
    </section>
  );
};

export default BlogCover;
