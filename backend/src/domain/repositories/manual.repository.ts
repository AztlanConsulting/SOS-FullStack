export interface ManualResult {
  name: string;
  price: number;
  content: string;
  imageUrl: string;
}

export interface GetManual {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
}

export interface ManualRepository {
  getManuals(manualRequest: GetManual): Promise<ManualResult[]>;
  getTotalManuals(manualRequest: GetManual): Promise<number>;
  getManualById(id: string): Promise<ManualResult | null>;
}
