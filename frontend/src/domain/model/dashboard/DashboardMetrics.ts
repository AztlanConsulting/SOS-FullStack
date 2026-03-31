export interface PlanProgress {
  planName: string;
  totalDays: number;
  daysRemaining: number;
}

export interface DistributionData {
  name: string;
  value: number;
}

export interface SalesData {
  name: string;
  value: number;
}

export interface VisitsData {
  day: number;
  val: number;
}

export interface DashboardMetrics {
  plan: PlanProgress;
  distribution: DistributionData[];
  sales: SalesData[];
  visits: VisitsData[];
}