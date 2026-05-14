import type { Order, PurchaseDetail } from '../../types/payment.types';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useRef } from 'react';
import { useStripeHook } from '@/features/payment/hooks/useStripeHook';
import { useCheckout } from '@/features/payment/hooks/useCheckOut';
import { Text } from '@/shared/components/ui/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { CopyButton } from '@/shared/components/ui/CopyButton';

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
  const paymentKeyRef = useRef(crypto.randomUUID());
  const { clientSecret, loading, paymentId, oxxoData, speiData } =
    useStripeHook(data, paymentKeyRef.current);
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

      const width = 700;
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
        {data.method === 'card' && <PaymentElement id="payment-element" />}

        {!showConfirmation && data.method === 'card' ? (
          <>
            <Button
              type="submit"
              disabled={isProcessing || !isReady}
              variant="primary"
              label={isProcessing ? 'Procesando...' : 'Pagar'}
            />
            {message && (
              <div id="payment-message" className="text-red-600 mt-2">
                {message}
              </div>
            )}
          </>
        ) : (
          <>
            {oxxoData && (
              <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="border-b border-gray-100 color-grey-bg px-5 py-4">
                  <Text variant="body" weight="semibold">
                    Pago en OXXO
                  </Text>

                  <Text
                    variant="caption"
                    color="color-grey-text"
                    className="mt-1"
                  >
                    Presenta el siguiente voucher en cualquier tienda OXXO y
                    realiza el pago antes de la fecha de vencimiento.
                  </Text>
                </div>

                <div className="flex flex-col gap-5 p-5">
                  <div>
                    <Text
                      variant="small"
                      weight="medium"
                      className="uppercase tracking-wide text-gray-400"
                    >
                      Monto a pagar
                    </Text>

                    <div className="flex items-center gap-2">
                      <Text variant="caption" className="text-gray-900">
                        {data.amount}
                      </Text>
                      <CopyButton
                        text={oxxoData.number || ''}
                        label="Copiar monoto a pagar"
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      variant="small"
                      weight="medium"
                      className="uppercase tracking-wide text-gray-400"
                    >
                      Número de voucher
                    </Text>

                    <div className="flex items-center gap-2">
                      <Text variant="caption" className="text-gray-900">
                        {oxxoData.number}
                      </Text>
                      <CopyButton
                        text={oxxoData.number || ''}
                        label="Copiar número de voucher"
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      variant="small"
                      weight="medium"
                      className="uppercase tracking-wide text-gray-400"
                    >
                      Válido por
                    </Text>

                    <Text variant="caption" className="text-gray-900">
                      {formatExpirationTime(oxxoData.expiresAfter)}
                    </Text>
                  </div>
                  <Button
                    variant="primary"
                    onClick={openVoucherPopup}
                    label="Ver voucher"
                    bgColor="bg-black hover:bg-gray-800 border-2 border-black"
                  />
                  <div className="rounded-lg color-grey-bg px-3 py-3">
                    <Text variant="caption" className="text-gray-600">
                      La confirmación del pago puede tardar algunos minutos
                      después de realizar el pago en caja.
                    </Text>
                  </div>
                </div>
              </div>
            )}
            {speiData && (
              <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="border-b border-gray-100 color-grey-bg px-5 py-4">
                  <Text variant="body" weight="semibold">
                    Datos bancarios para transferencia
                  </Text>

                  <Text
                    variant="caption"
                    color="color-grey-text"
                    className="mt-1"
                  >
                    Realiza la transferencia por el monto exacto utilizando
                    exactamente la siguiente CLABE y referencia para que podamos
                    identificar tu pago correctamente.
                  </Text>
                </div>

                <div className="flex flex-col gap-5 p-5">
                  <div>
                    <Text
                      variant="small"
                      weight="medium"
                      className="uppercase tracking-wide text-gray-400"
                    >
                      Monto a pagar
                    </Text>

                    <div className="flex items-center gap-2">
                      <Text
                        variant="body"
                        weight="semibold"
                        className="break-all text-gray-900"
                      >
                        ${data.amount}
                      </Text>
                      <CopyButton
                        text={`$${data.amount}`}
                        label="Copiar monto"
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      variant="small"
                      weight="medium"
                      className="uppercase tracking-wide text-gray-400"
                    >
                      CLABE
                    </Text>

                    <div className="flex items-center gap-2">
                      <Text
                        variant="body"
                        weight="semibold"
                        className="break-all text-gray-900"
                      >
                        {speiData.clabe}
                      </Text>
                      <CopyButton text={speiData.clabe} label="Copiar CLABE" />
                    </div>
                  </div>

                  <div>
                    <Text
                      variant="small"
                      weight="medium"
                      className="uppercase tracking-wide text-gray-400"
                    >
                      Referencia
                    </Text>

                    <div className="flex items-center gap-2">
                      <Text
                        variant="body"
                        weight="semibold"
                        className="break-all text-gray-900"
                      >
                        {speiData.reference}
                      </Text>
                      <CopyButton
                        text={speiData.reference}
                        label="Copiar referencia"
                      />
                    </div>
                  </div>

                  <div>
                    <Text
                      variant="small"
                      weight="medium"
                      className="uppercase tracking-wide text-gray-400"
                    >
                      Titular
                    </Text>

                    <div className="flex items-center gap-2">
                      <Text variant="caption" className="text-gray-900">
                        {speiData.holderName}
                      </Text>
                      <CopyButton
                        text={speiData.holderName || ''}
                        label="Copiar titular"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Text
                        variant="small"
                        weight="medium"
                        className="uppercase tracking-wide text-gray-400"
                      >
                        Banco
                      </Text>

                      <div className="flex items-center gap-2">
                        <Text variant="caption" className="text-gray-900">
                          {speiData.bankName}
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text
                        variant="small"
                        weight="medium"
                        className="uppercase tracking-wide text-gray-400"
                      >
                        Código del banco
                      </Text>

                      <div className="flex items-center gap-2">
                        <Text variant="caption" className="text-gray-900">
                          {speiData.bankCode}
                        </Text>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Text
                      variant="small"
                      weight="medium"
                      className="uppercase tracking-wide text-gray-400"
                    >
                      Dirección
                    </Text>

                    <div className="flex items-start gap-2">
                      <Text
                        variant="caption"
                        className="leading-relaxed text-gray-900"
                      >
                        {[
                          speiData.holderAddress?.line1,
                          speiData.holderAddress?.line2,
                          speiData.holderAddress?.postal_code,
                          speiData.holderAddress?.city,
                          speiData.holderAddress?.state,
                          speiData.holderAddress?.country,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </Text>
                    </div>
                  </div>

                  <div className="rounded-lg color-grey-bg px-3 py-3">
                    <Text variant="caption" className="text-gray-600">
                      La confirmación del pago puede tardar algunos minutos
                      dependiendo de tu banco.
                    </Text>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 bg-gray-50 color-grey-border rounded-lg">
              <Text
                variant="caption"
                as="p"
                weight="medium"
                className="leading-relaxed py-1 mb-4 text-gray-700"
              >
                {data.method === 'oxxo'
                  ? '¿Ya guardaste tu número de voucher? Al finalizar, te enviaremos una copia a tu correo para que puedas pagar en caja.'
                  : 'Asegúrate de copiar la CLABE y referencia. Al finalizar, te enviaremos estos detalles por correo para tu seguimiento.'}
              </Text>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={onConfirm}
                  variant="primary"
                  label="Entendido, finalizar"
                />
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
