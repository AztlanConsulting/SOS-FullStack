import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './CheckoutForm';
import { usePaymentPage } from '../hooks/usePaymentPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PaymentPage = () => {
  const { clientSecret, isSuccess, loading } = usePaymentPage();

  if (loading) return <p>Loading...</p>;

  if (isSuccess) {
    return (
      <div>
        <h1>Payment Successful 🎉</h1>
      </div>
    );
  }

  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  ) : (
    <p>Error loading payment</p>
  );
};
