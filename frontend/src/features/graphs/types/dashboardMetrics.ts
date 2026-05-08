/**
 * Tracks the lifecycle of a specific service plan.
 * Used for progress bars or "Time remaining" indicators.
 */
export interface PlanSubscriptionProgress {
  planName: string;
  totalDays: number;
  daysRemaining: number;
}

/**
 * Represents a segment in a distribution chart (e.g., Pie or Donut chart).
 * Used to visualize the market share of different plan types.
 */
export interface PlanDistributionMetric {
  name: string;
  value: number;
  color?: string;
}

/**
 * Geographic or categorical metrics.
 * Typically used for "Top Countries" lists or Bar charts showing sales by region.
 */
export interface CountryStatsMetric {
  name: string;
  value: number;
}

/**
 * Data point for time-series charts.
 * Tracks user traffic and interaction over a weekly period.
 */
export interface WeeklyVisit {
  week: string;
  views: number;
  engagement: number;
}

/**
 * The root aggregate object for the main Dashboard view.
 * Consolidates various metrics into a single data structure for the frontend.
 */
export interface DashboardStats {
  visits: WeeklyVisit[];
  sales: CountryStatsMetric[];
  plan: PlanSubscriptionProgress;
  distribution: PlanDistributionMetric[];
}
