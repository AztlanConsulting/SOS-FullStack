import React, { useRef } from 'react';
import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';
import {
  exportPosterAsPdfColor,
  exportPosterAsPdfBlackAndWhite,
} from '@/shared/services/posterExport.services';

interface AdProgressSectionProps {
  posterUrl: string | null;
}

export const AdProgressSection: React.FC<AdProgressSectionProps> = ({
  posterUrl,
}) => {
  const posterRef = useRef<HTMLImageElement>(null);

  const handleDownloadColor = () => {
    if (posterRef.current) {
      exportPosterAsPdfColor(posterRef.current, 'poster-mascota-color');
    }
  };

  const handleDownloadBW = () => {
    if (posterRef.current) {
      exportPosterAsPdfBlackAndWhite(posterRef.current, 'poster-mascota-bn');
    }
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
        <div className="w-full max-w-[212px]">
          <img
            ref={posterRef}
            src={posterUrl}
            alt="Póster de mascota perdida"
            className="w-full h-auto object-cover"
            crossOrigin="anonymous"
          />
        </div>

        <div className="w-full max-w-[280px] flex flex-col gap-3 mx-auto">
          <Button
            label="Descargar a Color"
            variant="primary"
            textColor="bg-purple-primary text-white hover:bg-dark-purple"
            onClick={handleDownloadColor}
          />

          <Button
            label="Descargar en B/N"
            textColor="bg-purple-primary text-white hover:bg-dark-purple"
            variant="primary"
            onClick={handleDownloadBW}
          />
        </div>
      </div>
    </div>
  );
};
