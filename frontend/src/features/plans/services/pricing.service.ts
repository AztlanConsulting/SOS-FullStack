import type { LocalizedItem } from '../types/pricing.types';

/**
 * Interface representing the structured data returned by the pricing API.
 * It consolidates geographical context and localized product catalogs.
 */
export interface PricingResponse {
  country: string | null;
  currencyCode: string;
  plans: LocalizedItem[];
  manuals: LocalizedItem[];
  workshops: LocalizedItem[];
}

/**
 *
 * Fetches the complete pricing manifest from the backend.
 * The backend handles IP-based geolocation and currency conversion
 * before returning this data.
 *
 * @returns {Promise<PricingResponse>} The localized pricing data for the current user.
 * @throws {Error} If the network request fails or returns a non-200 status.
 */
export const getPricing = async (): Promise<PricingResponse> => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${base_url}/pricing`);
  if (!response.ok) {
    throw new Error('Failed to fetch pricing information');
  }

  return response.json();
};
