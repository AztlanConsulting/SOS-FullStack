import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from './features/payment/components/CheckoutForm';
import './App.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  'pk_test_51TIGYYIozRMpgj0aNb41dRjPCn6xQATU6pcI7kx8zWmuB6wt4wIanzj9coqrzaMQKGuYvLedMjskat0zdYeXbYtq00SaeJyS6O',
);

function App() {
  const [clientSecret, setClientSecret] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if we are on the completion page
    if (window.location.pathname === '/completion') {
      setIsSuccess(true);
      return;
    }

    // Create PaymentIntent as soon as the page loads
    fetch('http://localhost:3000/payments/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 2000, currency: 'usd' }),
    })
      .then((res) => res.json())
      .then((data: { clientSecret: string | null }) =>
        setClientSecret(data.clientSecret ?? undefined),
      );
  }, []);

  const appearance = { theme: 'stripe' as const };

  if (isSuccess) {
    return (
      <div className="App">
        <h1>Payment Successful! 🎉</h1>
        <p>Your order has been saved to our database.</p>
        <button onClick={() => (window.location.href = '/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>SOS FullStack</h1>
      <p>Secure Payment Integration</p>

      {clientSecret ? (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
}

export default App;
