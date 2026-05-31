import type {
  FoundPetReportData,
  LostPetReportData,
} from '@/shared/types/petReport.types';
import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface PetReportContextType {
  lostPetReportData: LostPetReportData | null;
  setLostPetReportData: React.Dispatch<
    React.SetStateAction<LostPetReportData | null>
  >;
  foundPetReportData: FoundPetReportData | null;
  setFoundPetReportData: React.Dispatch<
    React.SetStateAction<FoundPetReportData | null>
  >;
}

const PetReportContext = createContext<PetReportContextType | undefined>(
  undefined,
);

export const PetReportProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [foundPetReportData, setFoundPetReportData] =
    useState<FoundPetReportData | null>(null);
  const [lostPetReportData, setLostPetReportData] =
    useState<LostPetReportData | null>(null);

  return (
    <PetReportContext.Provider
      value={{
        foundPetReportData,
        setFoundPetReportData,
        lostPetReportData,
        setLostPetReportData,
      }}
    >
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
