export interface ManualResult {
  name: string;
  price: number;
  content: string;
  imageUrl: string;
}

export interface ManualRepository {
  getManuals(): Promise<ManualResult[]>;
  getManualById(id: string): Promise<ManualResult | null>;
}
