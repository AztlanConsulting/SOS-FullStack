import { LocationSearchInput } from '../../../shared/components/ui/LocationSearchInput/LocationSearchInput';
import { MapDisplay } from '../../../shared/components/ui/MapDisplay/MapDisplay';
import type { PetReportData, ReportType } from '../types/petReport.types';
import { usePetLocation } from '../hooks/usePetLocation';

export interface PetLocationSectionProps {
  formData: Partial<PetReportData>;
  updateForm: (newData: Partial<PetReportData>) => void;
  reportType?: ReportType;
  mapID?: string;
  errors?: Record<string, string>;
  onInteraction?: () => void;
}

export const PetLocationSection = ({
  formData,
  updateForm,
  reportType = 'lost',
  mapID = 'pet-location-map',
  errors = {},
  onInteraction,
}: PetLocationSectionProps) => {
  const inputLabel =
    reportType === 'lost' ? 'Lugar de extravío' : 'Lugar de encuentro';
  const placeholderText = 'Ej: Parque Central, Centro Histórico';

  const {
    results,
    isLoading,
    displayValue,
    onSelectAddress,
    onSearchWrapper,
    onFocusWrapper,
  } = usePetLocation(mapID, formData, updateForm);

  return (
    <section
      id="pet-location-input"
      className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col py-4 bg-white gap-8"
    >
      <LocationSearchInput
        label={inputLabel}
        placeholder={placeholderText}
        query={displayValue}
        results={results}
        isLoading={isLoading}
        onFocus={() => {
          onFocusWrapper();
          onInteraction?.();
        }}
        onSearch={(value) => {
          onSearchWrapper(value);
          onInteraction?.();
        }}
        onSelect={(result) => {
          onSelectAddress(result);
          onInteraction?.();
        }}
        error={errors.address}
      />

      <MapDisplay mapID={mapID} />
    </section>
  );
};
