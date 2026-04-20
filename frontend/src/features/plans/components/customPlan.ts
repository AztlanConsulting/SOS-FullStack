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

/**
 * Metadata for features used for general reference or UI selection lists.
 */
export type FeatureInfo = {
  key: string;
  label: string;
};

/**
 * List of all possible features available across the custom plans.
 */
export const ALL_FEATURES: FeatureInfo[] = [
  { key: 'asesor', label: 'Asesor de búsqueda' },
  { key: 'geo_dinamica', label: 'Geolocalización dinámica' },
  { key: 'geo_doble', label: 'Geolocalización doble' },
  { key: 'reel', label: 'Reel de Instagram y Facebook' },
];

/**
 * Configuration for the various pricing brackets.
 * Base rates and feature costs adjust based on the length of the campaign.
 */
const getPricingTiers = (): PricingTier[] => [
  {
    minDays: 1,
    maxDays: 4,
    pricePerDay: 80,
    pricePerKm: 15,
    features: [
      { key: 'asesor', label: 'Asesor de búsqueda', price: 50 },
      { key: 'geo_dinamica', label: 'Geolocalización dinámica', price: 50 },
      { key: 'geo_doble', label: 'Geolocalización doble', price: 50 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 50 },
    ],
  },
  {
    minDays: 5,
    maxDays: 6,
    pricePerDay: 75,
    pricePerKm: 12.5,
    features: [
      { key: 'asesor', label: 'Asesor de búsqueda', price: 80 },
      { key: 'geo_dinamica', label: 'Geolocalización dinámica', price: 80 },
      { key: 'geo_doble', label: 'Geolocalización doble', price: 80 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 80 },
    ],
  },
  {
    minDays: 7,
    maxDays: 14,
    pricePerDay: 72,
    pricePerKm: 11.2,
    features: [
      { key: 'geo_doble', label: 'Geolocalización doble', price: 100 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 50 },
    ],
  },
  {
    minDays: 15,
    maxDays: 30,
    pricePerDay: 72,
    pricePerKm: 13,
    features: [
      { key: 'geo_doble', label: 'Geolocalización doble', price: 100 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 50 },
    ],
  },
];

/**
 * Locates the appropriate pricing tier based on the number of days requested.
 * @param days - Total duration of the plan.
 * @returns The matching PricingTier object.
 */
export const getTier = (days: number): PricingTier => {
  return getPricingTiers().find(
    (t) => days >= t.minDays && days <= t.maxDays,
  ) as PricingTier;
};

/**
 * Calculates the total cost of a customized plan.
 * Formula: (days * rate) + (km * rate) + (sum of selected feature prices)
 * * @param days - Duration.
 * @param km - Radius coverage.
 * @param selectedFeatures - Array of feature keys selected by the user.
 * @returns Total calculated price as a number.
 */
export const calculatePrice = (
  days: number,
  km: number,
  selectedFeatures: string[],
): number => {
  const tier = getTier(days);
  // Calculate the base cost using duration and distance rates
  const basePrice = days * tier.pricePerDay + km * tier.pricePerKm;
  // Sum the prices of all valid selected features within this tier
  const featuresPrice = tier.features
    .filter((f) => selectedFeatures.includes(f.key))
    .reduce((sum, f) => sum + f.price, 0);
  return basePrice + featuresPrice;
};
