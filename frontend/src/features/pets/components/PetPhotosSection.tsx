import { useState } from 'react';
import { FileUpload } from '../../../shared/components/ui/FileUpload/FileUpload';
import { PhotoDistributionPicker } from './PhotoDistributionPicker';

export const PetPhotosSection = () => {
  const [photoCount, setPhotoCount] = useState<1 | 2 | 3 | 4>(3);

  const fileUploadSlots = Array.from({ length: photoCount }, (_, i) => i + 1);

  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6 py-4">
      <h3 className="text-xl font-bold text-center mb-1">
        Fotos de la mascota
      </h3>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-700 font-medium">
          Selecciona la distribución de las fotos
        </p>
        <PhotoDistributionPicker value={photoCount} onChange={setPhotoCount} />
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <p className="text-sm text-gray-700 font-medium">
          Sube fotos de tu mascota
        </p>

        {fileUploadSlots.map((num) => (
          <FileUpload
            key={num}
            index={num}
            onChange={(file) => console.log(`Foto ${num} seleccionada:`, file)}
          />
        ))}
      </div>
    </section>
  );
};
