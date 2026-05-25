/**
 * Represents a specific add-on feature available for a plan.
 */
export type feature = {
  key: string; // Unique identifier for the feature
  label: string; //Display name
  price: number; //Price of the feature
};

/**
 * Defines a pricing bracket based on the duration (days) of the service.
 * Includes base rates and available features for that specific range.
 */
export type PricingTier = {
  minDays: number;
  maxDays: number;
  pricePerDay: number;
  pricePerKm: number;
  features: feature[];
};

export interface CustomPlanData {
  days: number;
  km: number;
  selectedFeatures: string[];
}
