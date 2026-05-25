import type { WeeklyVisit } from '../types/dashboardMetrics';
import { useEffect, useState } from 'react';

/**
 * useVisitMetrics Hook
 *
 * Fetches and manages time-series data related to weekly traffic and engagement.
 * This hook is reactive to time changes, automatically re-fetching data whenever
 * the specified year or month is updated.
 *
 * @param year - The target year for the metrics.
 * @param month - The target month (1-12) for the metrics.
 * @returns {Object} visit data array, loading state, and error message if applicable.
 */
export const useVisitMetrics = (year: number, month: number) => {
  const [visits, setVisits] = useState<WeeklyVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Abstraction for the API request logic.
     * Uses template literals to inject year/month into the query string.
     */
    const fetchVisits = async () => {
      setLoading(true);
      try {
        const data = await fetch(
          `/metrics/visits?year=${year}&month=${month}`,
        ).then((res) => res.json());
        setVisits(data);
      } catch (err) {
        setError('Failed to fetch visit metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [year, month]); // Re-run effect whenever time parameters change

  return { visits, loading, error };
};
