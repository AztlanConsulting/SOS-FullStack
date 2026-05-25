/**
 * Interface representing traffic and quality metrics grouped by week.
 */
export interface WeeklyVisit {
  week: string;
  views: number;
  engagement: number;
}

/**
 *
 * Interacts with the Umami Analytics API to calculate performance metrics
 * for a specific month. It divides the month into 4 distinct weekly blocks
 * and fetches aggregate data for each.
 *
 * Logic:
 * 1. Defines date ranges for 4 weeks (1-7, 8-14, 15-21, 22-end of month).
 * 2. Concurrent fetches: Retrieves pageviews and general stats (bounces/visits).
 * 3. Calculation: Derives "Engagement" by calculating the inverse of the Bounce Rate.
 *
 * @param year - The year to query.
 * @param month - The month to query (1-12).
 * @returns {Promise<WeeklyVisit[]>} An array of 4 weekly data points.
 */
export const getVisitMetric = async (
  year: number,
  month: number,
): Promise<WeeklyVisit[]> => {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  const apiKey = process.env.UMAMI_API_KEY;

  /**
   * Helper to calculate UNIX timestamps for the start and end of a standard week.
   */
  const getDayRange = (weekNum: number) => {
    const starts = [1, 8, 15, 22];
    const ends = [7, 14, 21, new Date(year, month, 0).getDate()];
    const start = new Date(year, month - 1, starts[weekNum]).getTime();
    const end = new Date(year, month - 1, ends[weekNum], 23, 59, 59).getTime();
    return { start, end };
  };

  // Process weeks in parallel using Promise.all
  const weeklyData = await Promise.all(
    [0, 1, 2, 3].map(async (weekIndex) => {
      const { start, end } = getDayRange(weekIndex);

      const [pageviewsRes, statsRes] = await Promise.all([
        fetch(
          `https://api.umami.is/v1/websites/${websiteId}/pageviews?startAt=${start}&endAt=${end}&unit=day&timezone=America/Mexico_City`,
          { headers: { 'x-umami-api-key': apiKey! } },
        ),
        fetch(
          `https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${start}&endAt=${end}`,
          { headers: { 'x-umami-api-key': apiKey! } },
        ),
      ]);

      const pageviewsData = await pageviewsRes.json();
      const statsData = await statsRes.json();

      // Aggregate pageviews from daily units into a weekly total
      const views =
        pageviewsData.pageviews?.reduce(
          (sum: number, item: { x: string; y: number }) => sum + item.y,
          0,
        ) ?? 0;

      // Calculate Engagement: The percentage of visitors who did NOT bounce
      const bounceRate =
        statsData.visits > 0
          ? (statsData.bounces / statsData.visits) * 100
          : 100;

      const engagement = Math.round(100 - bounceRate);

      return {
        week: `Semana ${weekIndex + 1}`,
        views,
        engagement,
      };
    }),
  );

  return weeklyData;
};
