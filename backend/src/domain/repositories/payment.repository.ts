export interface PaymentDBDto {
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  // change to clientId when registering client si finished
  clientSecret: string | null;
}
export interface PaymentRepository {
  createPending(data: PaymentDBDto): Promise<void>;
  markAsSucceeded(orderId: string): Promise<string>;
  findPaymentByOrderId(orderId: string): Promise<boolean>;
}
