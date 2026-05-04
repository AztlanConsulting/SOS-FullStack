import { usePetReport } from '@/features/users/context/PetReportContext';
import type { PetReportData } from '@/features/users/types/petReport.types';
import { useEffect } from 'react';

const TestComponent = ({
  mockRData,
  component,
}: {
  mockRData: PetReportData | null;
  component: React.ReactNode;
}) => {
  const { setReportData } = usePetReport();

  // Use an effect to set the data before the child component renders logic
  useEffect(() => {
    // @ts-ignore
    setReportData(mockRData);
  }, []);

  return component;
};

export default TestComponent;
