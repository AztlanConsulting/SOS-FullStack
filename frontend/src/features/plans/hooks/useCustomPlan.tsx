import { useState, useMemo } from 'react';
import { getTier, calculatePrice } from '../components/customPlan';

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
