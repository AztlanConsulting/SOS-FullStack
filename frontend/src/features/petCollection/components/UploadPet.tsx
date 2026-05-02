import type { ChangeEvent } from 'react';
import { LuUpload } from 'react-icons/lu';

interface Props {
  img: File | null;
  uploadFile: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}

const UploadPet = ({ img, uploadFile }: Props) => {
  return (
    <div className="bg-purple-secondary h-1/2 md:h-screen md:w-1/3 p-2 flex flex-col items-center justify-center gap-5">
      {img && (
        <img
          alt="Previsualización"
          src={URL.createObjectURL(img)}
          className="rounded-full border-2 border-purple-primary size-80 md:size-96 object-fill"
        />
      )}

      <label
        htmlFor="img-input"
        className="p-2 bg-purple-primary hover:bg-purple-secondary text-gray-200 hover:text-gray-500 border-2 border-purple-primary rounded-xl flex gap-2 items-center"
      >
        <LuUpload />
        {img ? 'Cambiar imagen' : 'Subir imagen'}
        <input
          type="file"
          onChange={(e) => uploadFile(e)}
          className="hidden"
          id="img-input"
        />
      </label>
    </div>
  );
};

export default UploadPet;
