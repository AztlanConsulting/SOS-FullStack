import { LocationSearchInput } from '../../../shared/components/ui/LocationSearchInput/LocationSearchInput';
import { MapDisplay } from '../../../shared/components/ui/MapDisplay/MapDisplay';
import type { PetReportData, ReportType } from '../types/petReport.types';
import { usePetLocation } from '../hooks/usePetLocation';
import { Text } from '@shared/components/ui/Text';

export interface PetLocationSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
  reportType?: ReportType;
  mapID?: string;
}

export const PetLocationSection = ({
  formData,
  updateForm,
  reportType = 'lost',
}: PetLocationSectionProps) => {
  const mapID = 'pet-location-map';
  const inputLabel =
    reportType === 'lost' ? 'Lugar de extravío' : 'Lugar de encuentro';
  const placeholderText = 'Ej: Parque Central, Centro Histórico';

  const { results, isLoading, displayValue, onSelectAddress, onSearchWrapper } =
    usePetLocation(mapID, formData, updateForm);

  return (
    <section
      id="pet-location-input"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col py-4 bg-white gap-8"
    >
      <div id="pet-location-section">
        <Text
          variant="h2"
          as="h2"
          weight="medium"
          className="text-center text-xl md:text-2xl "
        >
          Dónde se enocontró
        </Text>
      </div>
      <div className="w-full max-w-lg mx-auto">
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
      </div>
    </section>
  );
};
