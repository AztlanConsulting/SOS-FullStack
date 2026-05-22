export interface Plan {
  name: string;
  duration: number;
  createdAt: Date;
}

export interface PlanSubscriptionProgress {
  plans: Plan[];
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
  planProgress: PlanSubscriptionProgress[] | null;
}
