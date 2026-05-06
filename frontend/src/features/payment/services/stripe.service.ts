export const createPaymentIntent = async (
  amount: number,
  currency: string,
  method?: string,
  name?: string,
  email?: string,
) => {
  try {
    const base_url = import.meta.env.VITE_API_BASE_URL;
    console.log('Creating payment intent with:', {
      amount,
      currency,
      method,
      name,
      email,
    });
    const res = await fetch(`${base_url}/payments/payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, method, name, email }),
    });
    const data = await res.json();
    return data.result;
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    throw error;
  }
};
