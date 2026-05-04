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
  visits: DailyVisitsMetric[];
  sales: CountryStatsMetric[];
  plan: PlanSubscriptionProgress;
  distribution: PlanDistributionMetric[];
}

export interface PurchasedResourceResponse {
  id: string;
  name: string;
  type: 'manual' | 'workshop';
  imageUrl: string;
  description?: string;
}

export interface DashboardResponse {
  planProgress: PlanSubscriptionProgress | null;
  resources: PurchasedResourceResponse[];
}
