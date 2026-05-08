import type { Order, PurchaseDetail } from '../../types/payment.types';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useRef } from 'react';
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
  const { clientSecret, loading, paymentId, oxxoData } = useStripeHook(data);
  const lastOpenedVoucherUrl = useRef<string | null>(null);

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

    const formatExpirationTime = (timestamp: number | null) => {
      if (!timestamp) return 'Tiempo desconocido';

      const timeRemaining = timestamp * 1000 - Date.now();

      if (timeRemaining <= 0) return 'Expirado';

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
      );

      if (days > 0) {
        return `${days} día${days !== 1 ? 's' : ''} y ${hours}h`;
      }

      if (hours > 0) {
        return `${hours} hora${hours !== 1 ? 's' : ''} y ${minutes}m`;
      }

      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    };
    const openVoucherPopup = () => {
      if (!oxxoData?.voucherUrl) {
        return;
      }

      const width = 900;
      const height = 700;
      const left = Math.max((window.screen.width - width) / 2, 0);
      const top = Math.max((window.screen.height - height) / 2, 0);

      const popup = window.open(
        oxxoData.voucherUrl,
        'oxxoVoucherPopup',
        `popup=yes,width=${width},height=${height},left=${left},top=${top}`,
      );

      // Fallback if popup is blocked by browser settings.
      if (!popup) {
        window.open(oxxoData.voucherUrl, '_blank', 'noopener,noreferrer');
      }
    };

    useEffect(() => {
      if (data.method !== 'oxxo' || !oxxoData?.voucherUrl) {
        return;
      }

      if (lastOpenedVoucherUrl.current === oxxoData.voucherUrl) {
        return;
      }

      lastOpenedVoucherUrl.current = oxxoData.voucherUrl;
      setShowConfirmation(true);
      openVoucherPopup();
    }, [data.method, oxxoData?.voucherUrl, setShowConfirmation]);

    return (
      <form
        onSubmit={onSubmit}
        id="payment-form"
        className="flex flex-col gap-2"
      >
        <PaymentElement id="payment-element" />

        {!showConfirmation ? (
          <>
            <button
              type="submit"
              disabled={isProcessing || !isReady}
              id="submit"
              className="bg-black py-3 rounded-sm"
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
            {oxxoData && (
              <div className="flex flex-col gap-3 items-start color-grey-border rounded-lg p-3 mb-2">
                <p className="text-sm text-black">
                  Número de voucher: {oxxoData.number}
                </p>
                <p className="text-sm text-black">
                  Válido por: {formatExpirationTime(oxxoData.expiresAfter)}
                </p>
                <button
                  type="button"
                  onClick={openVoucherPopup}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Ver voucher
                </button>
              </div>
            )}
            <div className="p-4 bg-gray-50 color-grey-border rounded-lg">
              <p className="text-center font-medium mb-4">
                {data.method === 'oxxo'
                  ? 'Por favor confirma el pago en OXXO.'
                  : 'Por favor confirma el pago por SPEI'}
              </p>
              <div className="flex flex-col lg:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-sm text-gray-700 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 bg-black py-2 rounded-sm text-white hover:bg-gray-800"
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
