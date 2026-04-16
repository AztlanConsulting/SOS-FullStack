import React from 'react';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  mapID: string;
  heightClass?: string;
}

export const MapDisplay: React.FC<MapDisplayProps> = ({
  mapID,
  heightClass = 'h-[400px] sm:h-[450px]',
}) => {
  return (
    <div
      className={`w-full ${heightClass} rounded-xl border border-gray-300 overflow-hidden relative z-0`}
    >
      <div id={mapID} className="w-full h-full" />
    </div>
  );
};
