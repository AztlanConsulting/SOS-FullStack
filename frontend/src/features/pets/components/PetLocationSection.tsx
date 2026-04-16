import { useEffect } from 'react';
import { useGeocoding } from '../../map/hooks/useGeocoding';
import { useMap } from '../../map/hooks/useMap';
import { LocationSearchInput } from '../../../shared/components/ui/LocationSearchInput/LocationSearchInput';
import { MapDisplay } from '../../../shared/components/ui/MapDisplay/MapDisplay';
import type { PetReportData, ReportType } from '../types/petReport.types';

interface PetLocationSectionProps {
  data: Partial<PetReportData>;
  updateField: (field: keyof PetReportData, value: any) => void;
  reportType: ReportType;
}

export const PetLocationSection = ({
  updateField,
  reportType,
}: PetLocationSectionProps) => {
  const mapID = 'pet-location-map';

  // Hooks lógicos
  const { coords } = useMap(mapID);
  const { query, results, isLoading, handleSearch, handleSelect } =
    useGeocoding();

  // Sincronización con el formulario global
  useEffect(() => {
    updateField('locationCoords', coords);
  }, [coords]);

  const onSelectAddress = (result: any) => {
    handleSelect(result);
    updateField('address', result.displayName);
  };

  const title = reportType === 'lost' ? 'Donde se perdió' : 'Donde se encontró';
  const inputLabel =
    reportType === 'lost' ? 'Lugar de extravío' : 'Lugar de encuentro';
  const placeholderText = 'Ej: Tec de Monterrey Campus Querétaro, Calle...';

  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6 py-4">
      <h3 className="text-xl font-bold text-center mb-2">{title}</h3>

      {/* Componente UI extraído */}
      <LocationSearchInput
        label={inputLabel}
        placeholder={placeholderText}
        query={query}
        results={results}
        isLoading={isLoading}
        onSearch={handleSearch}
        onSelect={onSelectAddress}
      />

      {/* Componente UI extraído (ya con su CSS reparado) */}
      <MapDisplay mapID={mapID} />
    </section>
  );
};
