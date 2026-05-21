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

const mediaContentClass = 'w-full max-w-xs md:max-w-sm lg:w-1/2';
const actionsClass =
  'flex w-full max-w-xs flex-col gap-3 md:max-w-md md:flex-row md:gap-4 md:text-nowrap';

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
    <div className="flex h-full flex-col gap-5">
      <Text variant="h3" weight="medium" className="text-center w-full">
        Poster de tu mascota
      </Text>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 flex flex-1 flex-col items-center justify-center gap-6">
        <div className={mediaContentClass}>
          <img
            ref={posterRef}
            src={posterUrl}
            alt="Póster de mascota perdida"
            className="w-full h-auto object-cover"
            crossOrigin="anonymous"
          />
        </div>

        <div className={actionsClass}>
          <Button
            label="Descargar a Color"
            variant="primary"
            textColor="bg-purple-primary text-white hover:bg-dark-purple"
            onClick={handleDownloadColor}
          />

          <Button
            label="Descargar en B/N"
            textColor="bg-purple-secondary text-black hover:bg-dark-purple hover:text-white"
            variant="primary"
            onClick={handleDownloadBW}
          />
        </div>
      </div>
    </div>
  );
};
