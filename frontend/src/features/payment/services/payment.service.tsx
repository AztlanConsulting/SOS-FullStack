export const createPaymentIntent = async (
  amount: number, 
  currency: string,
  email: string,
  petName: string
) => {
  const res = await fetch(
    `${import.meta.env.VITE_REACT_APP_API_URL}/payments/payment-intent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, email, petName }), 
    },
  );

  if (!res.ok) {
    throw new Error('Error al iniciar el proceso de pago y registro');
  }
  const data: { clientSecret: string | null; registrationStarted: boolean } = await res.json();
  
  return data;
};
