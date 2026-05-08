import React from 'react';
import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';

interface AdProgressSectionProps {
  posterUrl: string | null;
}

export const AdProgressSection: React.FC<AdProgressSectionProps> = ({
  posterUrl,
}) => {
  const handleDownloadColor = () => {
    console.log('Descargar poster color');
  };

  const handleDownloadBW = () => {
    console.log('Descargar poster blanco y negro');
  };

  if (!posterUrl) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      <Text
        variant="h3"
        weight="medium"
        className="text-center lg:text-left w-full"
      >
        Poster de tu mascota
      </Text>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-6">
        <div className="w-full max-w-[280px]">
          <img
            src={posterUrl}
            alt="Póster de mascota perdida"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="w-full max-w-[280px] flex flex-col gap-3 mx-auto">
          <Button
            label="Descargar a Color"
            variant="primary"
            textColor="bg-purple-primary text-white hover:bg-[#866CA0]"
            onClick={handleDownloadColor}
          />

          <Button
            label="Descargar en B/N"
            textColor="bg-purple-primary text-white hover:bg-[#866CA0]"
            variant="primary"
            onClick={handleDownloadBW}
          />
        </div>
      </div>
    </div>
  );
};
