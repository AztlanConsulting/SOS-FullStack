import type { PricingData } from '../types/pricing.types';

export const getPricing = async (): Promise<PricingData> => {
  try {
    const response = await fetch('/api/pricing');
    if (!response.ok) {
      throw new Error('Failed to fetch pricing data');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
