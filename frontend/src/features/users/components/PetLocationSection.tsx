import { LocationSearchInput } from '../../../shared/components/ui/LocationSearchInput/LocationSearchInput';
import { MapDisplay } from '../../../shared/components/ui/MapDisplay/MapDisplay';
import type { PetReportData, ReportType } from '../types/petReport.types';
import { usePetLocation } from '../hooks/usePetLocation';

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
  const title = reportType === 'lost' ? 'Donde se perdió' : 'Donde se encontró';
  const inputLabel =
    reportType === 'lost' ? 'Lugar de extravío' : 'Lugar de encuentro';
  const placeholderText = 'Ej: Tec de Monterrey Campus Querétaro';

  const { results, isLoading, displayValue, onSelectAddress, onSearchWrapper } =
    usePetLocation(mapID, formData, updateForm);

  return (
    <section className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6 py-4 bg-white">
      <h3 className="text-xl font-bold text-center mb-2">{title}</h3>

      <LocationSearchInput
        label={inputLabel}
        placeholder={placeholderText}
        query={displayValue}
        results={results}
        isLoading={isLoading}
        onSearch={onSearchWrapper}
        onSelect={onSelectAddress}
      />

      <MapDisplay mapID={mapID} />
    </section>
  );
};
