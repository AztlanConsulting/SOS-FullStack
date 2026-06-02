import { Text } from '@shared/components/ui/Text/Text';
import PurchaseForm from '../features/purchases/components/PurchaseForm';
import Header from '@shared/components/layout/Header';
import PurchaseDetails from '../features/purchases/components/PurchaseDetails';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import Footer from '@shared/components/layout/Footer';
import type { PurchaseDetail } from '@features/payment/types/payment.types';
import { Modal } from '@/shared/components/ui/Modal/Modal';
import { usePayment } from '@/features/payment/hooks/usePayment';
import ConfirmPaymentModal from '@/features/purchases/components/ConfirmPaymentModal';
import PendingPaymentModal from '@/features/purchases/components/PendingPaymentModal';
import usePurchasePage from '@/features/purchases/hooks/usePurchasePage';
import { Suspense } from 'react';

// Container for purchase information and purchase logic
export const PurchasePage = () => {
  // Hooks to handle purchase flow and payments
  const purchaseData = usePurchasePage();
  const { error, setError } = usePayment();

  // Initialize data
  const { productId, productType, userEmail, userName, selectedPlan } =
    purchaseData.state ?? {};

  const { reportDataForCheckout, product } = purchaseData;
  const { navigateHome } = purchaseData;

  const [success, setSuccess] = purchaseData.successHook;
  const [pending, setPending] = purchaseData.pendingHook;
  const { isLoading, error: queryError } = purchaseData.query;

  const purchaseDetail: PurchaseDetail = {
    userName,
    userEmail,
    productId,
    productType,
  };

  function processPayment() {
    setSuccess(true);
  }

  function handlePending() {
    setPending(true);
  }

  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <main className="max-lg:pt-20 min-h-screen">
          {isLoading && <LoadingSpinner size="lg" />}
          {queryError && <Text>Error en la compra, intenta de nuevo</Text>}
          {Boolean(product || reportDataForCheckout) && (
            <div className="mx-auto flex flex-col lg:flex-row lg:row-0 lg:grid lg:grid-cols-2 mb-10 w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
              <PurchaseDetails
                product={product}
                reportData={reportDataForCheckout}
              />
              <PurchaseForm
                product={product}
                petReportData={reportDataForCheckout}
                success={processPayment}
                pending={handlePending}
                onMethodSelect={() => {
                  setSuccess(false);
                  setPending(false);
                }}
                purchaseDetail={purchaseDetail}
                selectedPlan={selectedPlan}
              />
            </div>
          )}
          {error && (
            <Modal
              title={'Error al intentar procesar el pago'}
              onClose={() => setError(null)}
            >
              <p className="text-center mb-2">
                Ha ocurrido un error inesperado.
              </p>
              <p className="text-center">Vuelve a intentar en unos momentos</p>
            </Modal>
          )}
          {/* Modal to show success state */}
          {success && (
            <ConfirmPaymentModal
              plan={reportDataForCheckout}
              product={product}
              onClose={() => {
                setSuccess(false);
                navigateHome();
              }}
            />
          )}
          {/* Modal to show pending state */}
          {pending && (
            <PendingPaymentModal
              plan={reportDataForCheckout}
              product={product}
              onClose={() => {
                setPending(false);
                navigateHome();
              }}
            />
          )}
        </main>
      </Suspense>
      <Footer />
    </>
  );
};
