export interface PaymentDBDto {
  orderId: string;
  amount: number;
  currency: string;
}
export interface PaymentRepository {
  createPending(data: PaymentDBDto): Promise<void>;
  markAsSucceeded(orderId: string): Promise<string>;
}
