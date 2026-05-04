import { useState, useEffect } from 'react';
import { getPlans } from '@features/plans/services/plan.service';
import { PLANS } from '@features/plans/components/plans';
import type { PlanCardProps } from '@features/plans/components/PlanCard';

/**
 * Custom hook to manage the fetching and merging of service plans.
 * It combines dynamic pricing data from the API with static feature descriptions.
 * * @returns An object containing the merged plans array, loading state, and error message.
 */
export const usePlans = () => {
  const [plans, setPlans] = useState<PlanCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Asynchronous function to fetch API data and merge it with local assets.
     */
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        /**
         * Merge API response with static data.
         * We iterate through API results and find the matching local configuration
         * based on the plan name to ensure UI features (tooltips, icons) are preserved.
         */
        const merged = data.map(
          (apiPlan: { name: string; price: number; _id: string }) => {
            const staticPlan = PLANS.find((p) => p.name === apiPlan.name);
            return {
              ...staticPlan,
              price: String(apiPlan.price),
              _id: apiPlan._id,
            };
          },
        );
        setPlans(merged);
      } catch (err) {
        setError('Failed to fetch plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};
