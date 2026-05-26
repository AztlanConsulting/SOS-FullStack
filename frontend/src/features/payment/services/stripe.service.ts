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
    extensionPlan,
  } = paymentIntent;

  try {
    const base_url = import.meta.env.VITE_API_BASE_URL;

    const numericAmount = typeof amount === 'number' ? amount : Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new Error('Invalid amount provided for payment intent');
    }

    const payload = {
      amount: numericAmount,
      currency,
      method,
      name,
      email,
      product,
      plan,
      extensionPlan,
    };

    // eslint-disable-next-line no-console
    console.debug('createPaymentIntent payload:', payload);

    const res = await fetch(`${base_url}/payments/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-idempotency-key': idempotencyKey ?? '',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      // eslint-disable-next-line no-console
      console.error('createPaymentIntent error', res.status, text);
      throw new Error(
        text || `Payment intent failed with status ${res.status}`,
      );
    }

    const data = await res.json();
    return data.result;
  } catch (error) {
    throw error;
  }
};
