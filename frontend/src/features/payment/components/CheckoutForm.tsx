import { PaymentElement } from '@stripe/react-stripe-js';
import { useCheckout } from '../hooks/useCheckOut';

export const CheckoutForm = () => {
  const { handleSubmit, isProcessing, message, isReady } = useCheckout();

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit} id="payment-form">
      <PaymentElement id="payment-element" />

      <button disabled={isProcessing || !isReady} id="submit">
        <span id="button-text">
          {isProcessing ? 'Processing...' : 'Pay now'}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};
