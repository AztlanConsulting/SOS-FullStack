import type { ChangeEvent } from 'react';
import { LuUpload } from 'react-icons/lu';

interface Props {
  img: File | null;
  uploadFile: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}

const UploadPet = ({ img, uploadFile }: Props) => {
  return (
    <div className="bg-purple-primary h-1/2 min-h-48 md:h-screen md:w-1/3 p-2 py-10 flex flex-col items-center justify-center gap-5 shadow-dark-purple shadow-lg">
      {img && (
        <img
          alt="Previsualización"
          src={URL.createObjectURL(img)}
          className="rounded-full border-2 border-dark-purple size-80 md:size-96 object-cover"
        />
      )}

      <label
        htmlFor="img-input"
        className="p-2 bg-dark-purple hover:bg-purple-secondary text-gray-200 hover:text-dark-purple border-2 border-purple-primary rounded-xl flex gap-2 items-center"
      >
        <LuUpload />
        {img ? 'Cambiar imagen' : 'Subir imagen'}
        <input
          type="file"
          onChange={(e) => uploadFile(e)}
          className="hidden"
          alt="Cambiar imagen"
          id="img-input"
        />
      </label>
    </div>
  );
};

export default UploadPet;
