import { useEffect, useState } from 'react';
import type { DashboardStats } from '@features/graphs/types/dashboardMetrics';

/**
 * usePlanDistribution Hook
 *
 * A specialized data-fetching hook that retrieves the statistical breakdown
 * of purchased plans. This data is typically consumed by Donut or Pie charts
 * to visualize product popularity within the dashboard.
 *
 * @returns {Object} An object containing the distribution data, loading state, and any fetch errors.
 */
export const usePlanDistribution = () => {
  const [distribution, setDistribution] = useState<
    DashboardStats['distribution']
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const data = await fetch('/metrics/plan-distribution').then((res) =>
          res.json(),
        );
        setDistribution(data);
      } catch {
        setError('Failed to fetch plan distribution');
      } finally {
        setLoading(false);
      }
    };
    fetchDistribution();
  }, []);

  return { distribution, loading, error };
};
