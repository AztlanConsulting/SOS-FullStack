import { useState, useEffect } from 'react';
import { useLocationContext } from '@shared/context/Location.context';
import { PLANS } from '@features/plans/components/plans';
import type { PlanCardProps } from '@features/plans/components/PlanCard';

/**
 *
 * Synchronizes localized pricing data from the LocationContext with the
 * static UI definitions (features, descriptions) of the plans.
 *
 * This hook performs a "Client-side Join":
 * 1. It listens for updates from the LocationProvider (API-driven pricing).
 * 2. It finds the matching visual configuration from the constant PLANS array.
 * 3. It returns a merged object ready for consumption by PlanCard components.
 *
 * @returns {Object} { plans: PlanCardProps[], loading: boolean, error: string | null }
 */
export const usePlans = (discounted: boolean) => {
  const {
    plans: localizedPlans,
    currencyCode,
    loading,
    error,
  } = useLocationContext();
  const [plans, setPlans] = useState<PlanCardProps[]>([]);

  useEffect(() => {
    // Wait until localized plans are fetched and available
    if (localizedPlans.length === 0) return;

    /**
     * Merge Strategy:
     * We iterate through the plans returned by the API (which have the correct currency/price)
     * and enrich them with static metadata (icons, feature lists) from the local codebase.
     */
    const merged = localizedPlans.flatMap((apiPlan) => {
      if (Boolean(apiPlan.discounted) !== discounted) {
        return [];
      }

      const staticPlan = PLANS.find((p) => p.name === apiPlan.name);
      if (!staticPlan) {
        return [];
      }

      return [
        {
          ...staticPlan,
          price: String(apiPlan.localizedPrice),
          currency: currencyCode,
        } as PlanCardProps,
      ];
    });

    setPlans(merged);
  }, [localizedPlans, currencyCode, discounted]);

  return { plans, loading, error };
};
