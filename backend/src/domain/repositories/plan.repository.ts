export interface PlanResult {
  name: string;
  price: number;
}

export interface PlanRepository {
  getPlans(): Promise<PlanResult[]>;
}
