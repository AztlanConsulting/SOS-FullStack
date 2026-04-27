import { Text } from '@shared/components/ui/Text/Text';
import PurchaseForm from '../features/purchases/components/PurchaseForm';
import Header from '@shared/components/layout/Header';
import PurchaseDetails from '../features/purchases/components/PurhcaseDetails';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import Footer from '@shared/components/layout/Footer';
import type { PurchaseDetail } from '@features/payment/types/payment.types';
import usePurchase from '@features/purchases/hooks/usePurchase';

// Container for purchase information and purchase logic
export const PurchasePage = () => {
  const { state, successHook, query } = usePurchase();
  const { productId, productType, userEmail, planDetails } = state;

  const [success, setSuccess] = successHook;
  // const { status, message, error, createPurchaseRequest } = useCreatePurchase({
  //   userEmail,
  //   paymentId,
  //   productId,
  //   productType,
  // });

  if (!state) return null;

  const { isLoading, error: queryError, data: product } = query;
  const purchaseDetail: PurchaseDetail = {
    userEmail,
    productId,
    productType,
  };

  function processPayment() {
    setSuccess(true);
  }

  return (
    <>
      <Header />
      <main className="max-md:pt-24 pt-4">
        {isLoading && <LoadingSpinner size="lg" />}
        {queryError && <Text>Error en la compra, intenta de nuevo</Text>}
        {(product || planDetails) && (
          <div className="sm:grid sm:grid-cols-2 mb-10">
            <PurchaseDetails
              product={product}
              plan={planDetails}
              success={success}
            />
            <PurchaseForm
              product={product}
              plan={planDetails}
              success={processPayment}
              purchaseDetail={purchaseDetail}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
