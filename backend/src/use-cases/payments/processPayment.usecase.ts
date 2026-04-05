import type { PaymentProvider } from '../../domain/ports/paymentProvider.port';

export class ProcessPayment {
  constructor(private paymentProvider: PaymentProvider) {}

  async execute(amount: number, currency: string) {
    return await this.paymentProvider.createIntent(amount, currency);
  }
}
