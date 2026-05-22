import React, { useState } from 'react';
import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';
import { Select } from '@shared/components/ui/Select/Select';
import {
  exportPosterAsPdfColor,
  exportPosterAsPdfBlackAndWhite,
} from '@/shared/services/posterExport.services';

interface AdProgressSectionProps {
  posterUrl: string | null;
}

const mediaContentClass = 'w-full px-10';
const actionsClass =
  'flex w-full max-w-xs flex-col gap-3 md:max-w-md md:flex-row md:gap-4 md:text-nowrap';
const PAPER_SIZES = [
  { label: 'Carta', value: 'letter' },
  { label: 'A4', value: 'a4' },
  { label: 'Oficio', value: 'legal' },
  { label: 'A3', value: 'a3' },
  { label: 'A5', value: 'a5' },
];

export const AdProgressSection: React.FC<AdProgressSectionProps> = ({
  posterUrl,
}) => {
  // Default to 'a4'
  const [selectedFormat, setSelectedFormat] = useState<string>('letter');

  const handleDownloadColor = () => {
    if (posterUrl) {
      exportPosterAsPdfColor(posterUrl, 'poster-mascota-color', selectedFormat);
    }
  };

  const handleDownloadBW = () => {
    if (posterUrl) {
      exportPosterAsPdfBlackAndWhite(
        posterUrl,
        'poster-mascota-bn',
        selectedFormat,
      );
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-1 flex-col items-center justify-between gap-6">
        <div className={mediaContentClass}>
          <img
            src={posterUrl}
            alt="Póster de mascota perdida"
            className="w-full h-auto object-cover"
            crossOrigin="anonymous"
          />
        </div>

        {/* Paper Size Dropdown Selector */}
        <div className="w-full">
          <Select
            label="Tamaño de impresión"
            id="paper-size"
            options={PAPER_SIZES.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            focusColor="purple"
          />
          <div className={`${actionsClass} mt-5`}>
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
    </div>
  );
};
