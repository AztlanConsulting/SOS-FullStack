export interface PlanSubscriptionProgress {
  planName: string;
  totalDays: number;
  daysRemaining: number;
  petName: string;
  petImage: string | null;
  posterImage: string | null;
  dateMissing: string;
  location: string;
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
  visits: DailyVisitsMetric[];
  sales: CountryStatsMetric[];
  plan: PlanSubscriptionProgress;
  distribution: PlanDistributionMetric[];
}

export interface DashboardResponse {
  planProgress: PlanSubscriptionProgress | null;
}
