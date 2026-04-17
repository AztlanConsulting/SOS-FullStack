import { useEffect } from 'react';
import { useGeocoding } from '../../map/hooks/useGeocoding';
import { useMap } from '../../map/hooks/useMap';
import { LocationSearchInput } from '../../../shared/components/ui/LocationSearchInput/LocationSearchInput';
import { MapDisplay } from '../../../shared/components/ui/MapDisplay/MapDisplay';
import type { PetReportData, ReportType } from '../types/petReport.types';

export interface PetLocationSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
  reportType?: ReportType;
}

export const PetLocationSection = ({
  formData,
  updateForm,
  reportType = 'lost',
}: PetLocationSectionProps) => {
  const mapID = 'pet-location-map';

  const { coords } = useMap(mapID);
  const { query, results, isLoading, handleSearch, handleSelect } =
    useGeocoding();

  useEffect(() => {
    if (coords) {
      updateForm({ locationCoords: coords });
    }
  }, [coords]);

  const onSelectAddress = (result: any) => {
    handleSelect(result);
    updateForm({
      address: result.displayName,
      location: result,
    });
  };

  const title = reportType === 'lost' ? 'Donde se perdió' : 'Donde se encontró';
  const inputLabel =
    reportType === 'lost' ? 'Lugar de extravío' : 'Lugar de encuentro';
  const placeholderText = 'Ej: Tec de Monterrey Campus Querétaro, Calle...';

  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6 py-4">
      <h3 className="text-xl font-bold text-center mb-2">{title}</h3>

      <LocationSearchInput
        label={inputLabel}
        placeholder={placeholderText}
        query={query}
        results={results}
        isLoading={isLoading}
        onSearch={handleSearch}
        onSelect={onSelectAddress}
      />

      <MapDisplay mapID={mapID} />
    </section>
  );
};
