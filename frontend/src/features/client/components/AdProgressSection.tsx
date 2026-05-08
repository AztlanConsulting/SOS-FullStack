import React from 'react';
import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';

interface AdProgressSectionProps {
  posterUrl: string | null;
}

export const AdProgressSection: React.FC<AdProgressSectionProps> = ({
  posterUrl,
}) => {
  if (!posterUrl) {
    return null; // Si no hay póster, no renderizamos nada
  }

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 w-full h-full justify-center">
      <Text variant="h3" weight="medium" className="text-center w-full mb-6">
        Póster de tu Mascota
      </Text>

      <div className="w-full max-w-[280px] overflow-hidden rounded-lg shadow-md bg-[#F9F1DE] mb-6 mx-auto">
        <img
          src={posterUrl}
          alt="Póster de mascota perdida"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="w-[250px] mx-auto">
        <a
          href={posterUrl}
          download="poster_mascota.png"
          target="_blank"
          rel="noreferrer"
          className="w-full block"
        >
          <Button
            label="Descargar Póster"
            variant="primary"
            onClick={() => {}}
            textColor="bg-purple-primary text-white hover:bg-[#866CA0]"
          />
        </a>
      </div>
    </div>
  );
};
