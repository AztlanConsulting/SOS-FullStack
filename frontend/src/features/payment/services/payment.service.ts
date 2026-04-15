export const createPaymentIntent = async (amount: number, currency: string) => {
  try {
    const base_url = import.meta.env.VITE_REACT_APP_API_URL;
    const res = await fetch(`${base_url}/payments/payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    });
    const data: { clientSecret: string | null } = await res.json();
    return data.clientSecret;
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    throw error;
  }
};
