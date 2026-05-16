import { usePetReport } from '@/shared/context/PetReportContext';
import { useEffect } from 'react';
import type { LostPetReportData } from '@/shared/types/petReport.types';

const TestComponent = ({
  mockRData,
  component,
}: {
  mockRData: LostPetReportData | null;
  component: React.ReactNode;
}) => {
  const { setLostPetReportData } = usePetReport();

  // Use an effect to set the data before the child component renders logic
  useEffect(() => {
    // @ts-ignore
    setLostPetReportData(mockRData);
  }, []);

  return component;
};

export default TestComponent;
