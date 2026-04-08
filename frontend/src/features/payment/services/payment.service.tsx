export const createPaymentIntent = async (amount: number, currency: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_API_URL}/payments/payment-intent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    },
  );
  const data: { clientSecret: string | null } = await res.json();
  return data.clientSecret;
};
