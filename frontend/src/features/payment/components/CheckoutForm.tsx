import { PaymentElement } from '@stripe/react-stripe-js';
import { useCheckout } from '../hooks/useCheckOut';

export const CheckoutForm = () => {
  const { handleSubmit, isProcessing, message, isReady } = useCheckout();

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit} id="payment-form" className="flex flex-col">
      <PaymentElement id="payment-element" />

      <button
        disabled={isProcessing || !isReady}
        id="submit"
        className="mt-6 bg-black py-3 rounded-sm"
      >
        <span id="button-text" className="text-white">
          {isProcessing ? 'Processing...' : 'Pay now'}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};
