import { useState, useEffect } from 'react';
import { getPlans } from '@features/plans/services/plan.service';
import { PLANS } from '../components/plans';
import type { PlanCardProps } from '../components/PlanCard';

export const usePlans = () => {
  const [plans, setPlans] = useState<PlanCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        const merged = data.map((apiPlan: { name: string; price: number }) => {
          const staticPlan = PLANS.find((p) => p.name === apiPlan.name);
          console.log(
            'apiPlan:',
            apiPlan.name,
            '| staticPlan:',
            staticPlan?.name || 'Not found',
          );
          return {
            ...staticPlan,
            price: String(apiPlan.price),
          };
        });
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
