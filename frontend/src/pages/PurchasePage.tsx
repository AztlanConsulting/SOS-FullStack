import { Text } from '@shared/components/ui/Text/Text';
import PurchaseForm from '../features/purchases/components/PurchaseForm';
import Header from '@shared/components/layout/Header';
import PurchaseDetails from '../features/purchases/components/PurhcaseDetails';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import Footer from '@shared/components/layout/Footer';
import type { PurchaseDetail } from '@features/payment/types/payment.types';
import usePurchase from '@features/purchases/hooks/usePurchase';
import { usePetReport } from '@/features/users/context/PetReportContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import type { Product } from '@/shared/types/purchase.types';

// Container for purchase information and purchase logic
export const PurchasePage = () => {
  const successHook = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const { reportData } = usePetReport();
  const { state, query } = usePurchase();
  const navigate = useNavigate();
  const { productId, productType, userEmail } = state ?? {};

  const [success, setSuccess] = successHook;

  const { isLoading, error: queryError, data } = query;

  useEffect(() => {
    const p: Product | undefined = reportData ? undefined : data;
    setProduct(p);

    if (!Boolean(state) && !Boolean(reportData)) {
      navigate('/');
    }
  }, [data, state]);

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
        {Boolean(product || reportData) && (
          <div className="sm:grid sm:grid-cols-2 mb-10">
            <PurchaseDetails
              product={product}
              reportData={reportData}
              success={success}
            />
            <PurchaseForm
              product={product}
              petReportData={reportData}
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
