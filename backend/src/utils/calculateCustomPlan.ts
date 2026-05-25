import type { CustomPlanData, PricingTier } from '@/types/plan.types';

/**
 * Configuration for the various pricing brackets.
 * Base rates and feature costs adjust based on the length of the campaign.
 */
const getPricingTiers = (): PricingTier[] => [
  {
    minDays: 1,
    maxDays: 4,
    pricePerDay: 4.5,
    pricePerKm: 0.85,
    features: [
      { key: 'asesor', label: 'Asesor de búsqueda', price: 2.8 },
      { key: 'geo_dinamica', label: 'Geolocalización dinámica', price: 2.8 },
      { key: 'geo_doble', label: 'Geolocalización doble', price: 2.8 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 2.8 },
    ],
  },
  {
    minDays: 5,
    maxDays: 6,
    pricePerDay: 4.25,
    pricePerKm: 0.7,
    features: [
      { key: 'asesor', label: 'Asesor de búsqueda', price: 4.5 },
      { key: 'geo_dinamica', label: 'Geolocalización dinámica', price: 4.5 },
      { key: 'geo_doble', label: 'Geolocalización doble', price: 4.5 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 4.5 },
    ],
  },
  {
    minDays: 7,
    maxDays: 14,
    pricePerDay: 4.0,
    pricePerKm: 0.65,
    features: [
      { key: 'geo_doble', label: 'Geolocalización doble', price: 5.6 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 2.8 },
    ],
  },
  {
    minDays: 15,
    maxDays: 30,
    pricePerDay: 4.0,
    pricePerKm: 0.75,
    features: [
      { key: 'geo_doble', label: 'Geolocalización doble', price: 5.6 },
      { key: 'reel', label: 'Reel de Instagram y Facebook', price: 2.8 },
    ],
  },
];

/**
 * Locates the appropriate pricing tier based on the number of days requested.
 * @param days - Total duration of the plan.
 * @returns The matching PricingTier object.
 */
export const getTier = (days: number): PricingTier => {
  const tier = getPricingTiers().find(
    (t) => days >= t.minDays && days <= t.maxDays,
  );
  return tier || getPricingTiers()[0];
};

/**
 * Calculates the total cost of a customized plan.
 * Formula: (days * rate) + (km * rate) + (sum of selected feature prices)
 * * @param days - Duration.
 * @param km - Radius coverage.
 * @param selectedFeatures - Array of feature keys selected by the user.
 * @returns Total calculated price as a number.
 */
export const calculatePrice = ({
  days,
  km,
  selectedFeatures,
}: CustomPlanData): number => {
  const tier = getTier(days);
  // Calculate the base cost using duration and distance rates
  const basePrice = days * tier.pricePerDay + km * tier.pricePerKm;
  // Sum the prices of all valid selected features within this tier
  const featuresPrice = tier.features
    .filter((f) => selectedFeatures.includes(f.key))
    .reduce((sum, f) => sum + f.price, 0);
  return basePrice + featuresPrice;
};
