import { StripeProvider } from '../api/stripeProvider.api';
import { ProcessPayment } from '../../use-cases/payments/processPayment.usecase';

// Infrastructure implementations
const stripeProvider = new StripeProvider();

// Use Cases (Injected with implementations)
export const processPaymentUseCase = new ProcessPayment(stripeProvider);
