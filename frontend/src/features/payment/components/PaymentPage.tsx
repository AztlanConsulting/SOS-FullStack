import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './CheckoutForm';
import { usePaymentPage } from '../hooks/usePaymentPage';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PaymentPage = () => {
  const { clientSecret, isSuccess, loading } = usePaymentPage();

  if (loading) return <p className="align-center">Loading...</p>;

  if (isSuccess) {
    return (
      <div>
        <h3 className="align-center">Payment Successful</h3>
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
