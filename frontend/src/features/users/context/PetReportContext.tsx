import type { ReactNode } from 'react';
import React, { createContext, useState, useContext } from 'react';
import type { PetReportData } from '../types/petReport.types';

// Definimos qué información vivirá en el contexto
interface PetReportContextType {
  reportData: PetReportData | null;
  setReportData: (data: PetReportData) => void;
}

const PetReportContext = createContext<PetReportContextType | undefined>(
  undefined,
);

// Creamos el "Proveedor" que envolverá nuestra App
export const PetReportProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reportData, setReportData] = useState<PetReportData | null>(null);

  return (
    <PetReportContext.Provider value={{ reportData, setReportData }}>
      {children}
    </PetReportContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const usePetReport = () => {
  const context = useContext(PetReportContext);
  if (!context) {
    throw new Error('usePetReport debe usarse dentro de un PetReportProvider');
  }
  return context;
};
