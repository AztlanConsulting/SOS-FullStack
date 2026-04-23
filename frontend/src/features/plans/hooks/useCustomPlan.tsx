import { useState, useMemo } from 'react';
import type { FeatureInfo, PricingTier } from '../types/customPlan';

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

/**
 * Custom hook to manage the state and logic for building a personalized plan.
 * Handles calculation updates, tier shifts, and feature selection logic.
 */
export const useCustomPlan = () => {
  const [days, setDays] = useState(3);
  const [km, setKm] = useState(5);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  /**
   * Memoized tier information.
   * Updates only when the number of days changes to determine available features and rates.
   */
  const tier = useMemo(() => getTier(days), [days]);

  /**
   * Toggles a feature's selection status.
   * Adds the feature key if missing, or removes it if already present in the array.
   * @param key - The unique identifier of the feature.
   */
  const toggleFeature = (key: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  /**
   * Updates the duration of the plan and manages feature compatibility.
   * If the new day count triggers a change in pricing tiers, selected features
   * are reset to avoid carrying over invalid features or incorrect pricing.
   * @param newDays - The new duration selected by the user.
   */
  const handleDaysChange = (newDays: number) => {
    const newTier = getTier(newDays);
    const currentTier = getTier(days);
    if (newTier.minDays !== currentTier.minDays) {
      setSelectedFeatures([]);
    }
    setDays(newDays);
  };

  /**
   * Memoized total price calculation.
   * Re-runs whenever days, kilometers, or feature selections change.
   */
  const totalPrice = useMemo(
    () => calculatePrice(days, km, selectedFeatures),
    [days, km, selectedFeatures],
  );

  return {
    days,
    km,
    tier,
    selectedFeatures,
    totalPrice,
    handleDaysChange,
    setKm,
    toggleFeature,
  };
};
