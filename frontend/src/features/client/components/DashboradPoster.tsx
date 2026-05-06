import React, { useRef } from 'react';
import { Poster } from '@/features/poster/components/Poster.component';
import type { LostPetReportData } from '@/shared/types/petReport.types';
import { Button } from '@shared/components/ui/Button/Button';

export const DashboardPoster = ({
  petData,
}: {
  petData: LostPetReportData;
}) => {
  const posterRef = useRef<HTMLDivElement>(null);

  const scale = 0.3;
  const width = 1080 * scale;
  const height = 1350 * scale;

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Póster de Búsqueda</h3>

      <div
        className="relative overflow-hidden rounded-lg shadow-md mb-4 bg-gray-100"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '1080px',
            height: '1350px',
          }}
        >
          <Poster ref={posterRef} pet={petData} />
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4 text-center">
        Este póster se genera automáticamente con los datos de tu reporte.
      </p>
    </div>
  );
};
