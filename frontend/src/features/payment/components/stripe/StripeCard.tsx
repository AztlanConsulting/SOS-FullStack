import type { Order, PurchaseDetail } from '../../types/payment.types';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStripeHook } from '@/features/payment/hooks/useStripeHook';
import { useCheckout } from '@/features/payment/hooks/useCheckOut';

interface Props {
  data: Order;
  purchaseDetail: PurchaseDetail;
  success: () => void;
  pending: () => void;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/*
* Stripe Card component
  @params data: Order details as price, currency, object, etc
  @params: purchaseDetail: Information of transaction and user
*/
export const StripeCard = ({
  data,
  purchaseDetail,
  success,
  pending,
}: Props) => {
  const { clientSecret, loading, paymentId } = useStripeHook(data, pending);

  const PaymentForm: React.FC = () => {
    const { handleSubmit, isProcessing, message, isReady } = useCheckout({
      paymentId,
      purchaseDetail,
      paymentMethod: data.method,
      onSuccess: success,
      onPending: pending,
    });

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
            {isProcessing ? 'Procesando...' : 'Pagar'}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    );
  };

  if (loading) return <p className="align-center">Cargando...</p>;

  return clientSecret ? (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm />
    </Elements>
  ) : (
    <p>Error al cargar pago</p>
  );
};

export default StripeCard;
