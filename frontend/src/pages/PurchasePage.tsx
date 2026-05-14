import { Text } from '@shared/components/ui/Text/Text';
import PurchaseForm from '../features/purchases/components/PurchaseForm';
import Header from '@shared/components/layout/Header';
import PurchaseDetails from '../features/purchases/components/PurchaseDetails';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import Footer from '@shared/components/layout/Footer';
import type { PurchaseDetail } from '@features/payment/types/payment.types';
import usePurchase from '@features/purchases/hooks/usePurchase';
import { usePetReport } from '@/shared/context/PetReportContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import type { Product } from '@/shared/types/purchase.types';

// Container for purchase information and purchase logic
export const PurchasePage = () => {
  const successHook = useState(false);
  const pendingHook = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const { lostPetReportData } = usePetReport();
  const { state, query } = usePurchase();
  const navigate = useNavigate();
  const { productId, productType, userEmail, userName } = state ?? {};

  const [success, setSuccess] = successHook;
  const [pending, setPending] = pendingHook;
  const { isLoading, error: queryError, data } = query;

  useEffect(() => {
    const p: Product | undefined = lostPetReportData ? undefined : data;
    setProduct(p);
  }, [data, lostPetReportData]);

  useEffect(() => {
    if (!Boolean(state) && !Boolean(lostPetReportData)) {
      navigate('/');
    }
  }, [state, lostPetReportData]);

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
      <main className="max-lg:pt-24 pt-4 min-h-screen">
        {isLoading && <LoadingSpinner size="lg" />}
        {queryError && <Text>Error en la compra, intenta de nuevo</Text>}
        {Boolean(product || lostPetReportData) && (
          <div className="mx-auto flex flex-col lg:flex-row lg:row-0 lg:grid lg:grid-cols-2 mb-10 w-full w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
            <PurchaseDetails
              product={product}
              reportData={lostPetReportData}
              success={success}
              pending={pending}
              onCloseSuccess={() => setSuccess(false)}
              onClosePending={() => setPending(false)}
            />
            <PurchaseForm
              product={product}
              petReportData={lostPetReportData}
              success={processPayment}
              pending={handlePending}
              onMethodSelect={() => {
                setSuccess(false);
                setPending(false);
              }}
              purchaseDetail={purchaseDetail}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
