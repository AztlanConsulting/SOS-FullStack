export interface PaymentDBDto {
  orderId: string;
  amount: number;
  currency: string;
  // change to clientId when registering client si finished
  clientSecret?: string;
}
export interface PaymentRepository {
  createPending(data: PaymentDBDto): Promise<void>;
  markAsSucceeded(orderId: string): Promise<string>;
}
