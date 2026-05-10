import React from 'react';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  mapID: string;
  heightClass?: string;
  isLocating?: boolean;
  onGoToMyLocation?: () => void;
}

export const MapDisplay: React.FC<MapDisplayProps> = ({
  mapID,
  heightClass = 'h-[400px] sm:h-[450px]',
  isLocating = false,
  onGoToMyLocation,
}) => {
  return (
    <div
      className={`w-full ${heightClass} rounded-xl border border-gray-300 overflow-hidden relative z-0`}
    >
      <div id={mapID} className="w-full h-full" />

      {onGoToMyLocation && (
        <button
          type="button"
          onClick={onGoToMyLocation}
          disabled={isLocating}
          title="Ir a mi ubicación actual"
          className="absolute bottom-4 right-4 z-[400] flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:bg-white hover:text-yellow-600 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70 disabled:hover:translate-y-0 transition-all duration-200 cursor-pointer text-gray-600"
        >
          {isLocating ? (
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-500" />
            </span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
              <circle cx="12" cy="12" r="7" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};
