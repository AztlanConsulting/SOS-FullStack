import React, { useContext, useState, useEffect } from 'react';
import { getPricing } from '../../features/plans/services/pricing.service';
import type { LocalizedItem } from '../../features/plans/types/pricing.types';

/**
 * Interface defining the shape of the location and pricing state.
 * This context provides global access to user-specific geographical data
 * and product catalogs with pre-calculated localized prices.
 */
interface LocationContextType {
  country: string | null;
  currencyCode: string;
  exchangeRate: number;
  plans: LocalizedItem[];
  manuals: LocalizedItem[];
  workshops: LocalizedItem[];
  loading: boolean;
  error: string | null;
}

const LocationContext = React.createContext<LocationContextType | null>(null);

/**
 * LocationProvider
 *
 * A React context provider that manages the location and pricing state.
 * It fetches the latest pricing information from the backend and makes it available
 * to all components within its subtree.
 *
 * @param children - The child nodes that will have access to the location context.
 * @returns {React.ReactNode} The wrapped child nodes with the location context.
 */
export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [country, setCountry] = useState<string | null>(null);
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [plans, setPlans] = useState<LocalizedItem[]>([]);
  const [manuals, setManuals] = useState<LocalizedItem[]>([]);
  const [workshops, setWorkshops] = useState<LocalizedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Initializes pricing data by calling the localized pricing service.
     */
    const fetchPricing = async () => {
      try {
        const data = await getPricing();
        setCountry(data.country);
        setCurrencyCode(data.currencyCode);
        setPlans(data.plans);
        setManuals(data.manuals);
        setWorkshops(data.workshops);

        if (data.plans.length > 0) {
          setExchangeRate(data.plans[0].exchangeRate);
        }
      } catch (err) {
        setError('Failed to fetch pricing information');
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        country,
        currencyCode,
        exchangeRate,
        plans,
        manuals,
        workshops,
        loading,
        error,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

/**
 *
 * Custom hook to consume the LocationContext.
 * Includes a safety check to ensure it is used within its corresponding Provider.
 *
 * @returns {LocationContextType} The current location and pricing state.
 * @throws {Error} If called outside of a LocationProvider.
 */
export const useLocationContext = () => {
  const context = useContext(LocationContext);
  console.log('LocationContext value:', context);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
