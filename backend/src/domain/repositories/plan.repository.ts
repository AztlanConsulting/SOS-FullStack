/**
 * Data structure for plan information returned by the repository.
 * Represents the core plan details stored in the persistence layer.
 */
export interface PlanResult {
  name: string;
  price: number;
}
/**
 * Interface for the Plan repository.
 * Defines the contract for accessing and retrieving plan data from a data source.
 */
export interface PlanRepository {
  /**
   * Retrieves all available plans from the database.
   * @returns A promise that resolves to an array of PlanResult objects.
   */
  getPlans(): Promise<PlanResult[]>;
}
