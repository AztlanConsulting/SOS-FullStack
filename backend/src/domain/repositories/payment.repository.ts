export interface PaymentDBDto {
  stripeId: string;
  amount: number;
  currency: string;
}
export interface PaymentRepository {
  createPending(data: PaymentDBDto): Promise<void>;
  markAsSucceeded(stripeId: string): Promise<string>;
}
