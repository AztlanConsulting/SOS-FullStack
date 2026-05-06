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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
  locale: 'es',
});

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
    const {
      handleSubmit,
      handleConfirmation,
      isProcessing,
      message,
      isReady,
      showConfirmation,
      setShowConfirmation,
    } = useCheckout({
      data,
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

    const onConfirm = () => {
      setShowConfirmation(false);
      handleConfirmation();
    };

    return (
      <form
        onSubmit={onSubmit}
        id="payment-form"
        className="flex flex-col gap-4"
      >
        <PaymentElement id="payment-element" />

        {!showConfirmation ? (
          <>
            <button
              type="submit"
              disabled={isProcessing || !isReady}
              id="submit"
              className="mt-6 bg-black py-3 rounded-sm"
            >
              <span id="button-text" className="text-white">
                {isProcessing ? 'Procesando...' : 'Pagar'}
              </span>
            </button>
            {message && (
              <div id="payment-message" className="text-red-600 mt-2">
                {message}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="p-4 bg-gray-50 rounded-sm border border-gray-200">
              <p className="text-center font-medium mb-4">
                {data.method === 'oxxo'
                  ? 'Por favor confirma el pago en OXXO.'
                  : 'Por favor confirma el pago por SPEI'}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-300 py-3 rounded-sm text-gray-700 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 bg-black py-3 rounded-sm text-white hover:bg-gray-800"
                >
                  Confirmar
                </button>
              </div>
            </div>
            {message && (
              <div id="payment-message" className="text-red-600 mt-2">
                {message}
              </div>
            )}
          </>
        )}
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
