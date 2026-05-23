import type { PaymentIntent } from '../types/payment.types';

export const createPaymentIntent = async (paymentIntent: PaymentIntent) => {
  const {
    amount,
    currency,
    method,
    name,
    email,
    product,
    plan,
    idempotencyKey,
  } = paymentIntent;

  try {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    const res = await fetch(`${base_url}/payments/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-idempotency-key': idempotencyKey ?? '',
      },
      body: JSON.stringify({
        amount,
        currency,
        method,
        name,
        email,
        product,
        plan,
      }),
    });
    const data = await res.json();
    return data.result;
  } catch (error) {
    throw error;
  }
};
