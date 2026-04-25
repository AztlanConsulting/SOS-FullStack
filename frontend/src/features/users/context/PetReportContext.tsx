import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useEffect } from 'react';
import type { PetReportData } from '../types/petReport.types';

interface PetReportContextType {
  reportData: PetReportData | null;
  setReportData: (data: PetReportData) => void;
}

const PetReportContext = createContext<PetReportContextType | undefined>(
  undefined,
);

export const PetReportProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reportData, setReportData] = useState<PetReportData | null>(null);

  useEffect(() => {
    console.log('[PetReportContext] reportData updated:', reportData);
  }, [reportData]);

  return (
    <PetReportContext.Provider value={{ reportData, setReportData }}>
      {children}
    </PetReportContext.Provider>
  );
};

export const usePetReport = () => {
  const context = useContext(PetReportContext);
  if (!context) {
    throw new Error('usePetReport debe usarse dentro de un PetReportProvider');
  }
  return context;
};
