export interface PlanSubscriptionProgress {
  planName: string;
  totalDays: number;
  daysRemaining: number;
}

export interface PlanDistributionMetric {
  name: string;
  value: number;
  color?: string;
}

export interface CountryStatsMetric {
  name: string;
  value: number;
}

export interface DailyVisitsMetric {
  day: number;
  val: number;
}

export interface DashboardStats {
  subscription: PlanSubscriptionProgress;
  planDistribution: PlanDistributionMetric[];
  countryStats: CountryStatsMetric[];
  dailyVisits: DailyVisitsMetric[];
}
