import { Text } from '@shared/components/ui/Text/Text';
import PurchaseForm from '../features/purchases/components/PurchaseForm';
import PurchaseDetails from '../features/purchases/components/PurchaseDetails';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import type { PurchaseDetail } from '@features/payment/types/payment.types';
import usePurchase from '@features/purchases/hooks/usePurchase';
import { usePetReport } from '@/shared/context/PetReportContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import type { Product } from '@/shared/types/purchase.types';
import { useLocationContext } from '@/shared/context/Location.context';

// Container for purchase information and purchase logic
export const ExclusivePurchasePage = () => {
  const successHook = useState(false);
  const pendingHook = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const { lostPetReportData } = usePetReport();
  const { state, query } = usePurchase();
  const navigate = useNavigate();
  const { exchangeRate } = useLocationContext();
  const { productId, productType, userEmail, userName, selectedPlan } =
    state ?? {};

  const [success, setSuccess] = successHook;
  const [pending, setPending] = pendingHook;
  const { isLoading, error: queryError, data } = query;
  const isPlanExtension = productType === 'plan-extension';
  const reportDataForCheckout = isPlanExtension ? null : lostPetReportData;

  useEffect(() => {
    if (selectedPlan && productType === 'plan-extension') {
      setProduct({
        _id: productId,
        imageUrl: '',
        name: selectedPlan.name,
        content: [],
        price: selectedPlan.price / (exchangeRate || 1),
        radius: selectedPlan.radius,
        duration: selectedPlan.duration,
        features: selectedPlan.features.map((feature: any) => ({
          label: feature,
          included: true,
        })),
        petId: selectedPlan.petId,
      });

      return;
    }

    const p: Product | undefined = reportDataForCheckout ? undefined : data;
    setProduct(p);
  }, [
    data,
    reportDataForCheckout,
    selectedPlan,
    productId,
    productType,
    exchangeRate,
  ]);

  useEffect(() => {
    if (!Boolean(state) && !Boolean(reportDataForCheckout)) {
      navigate('/');
    }
  }, [state, reportDataForCheckout]);

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
      <main className="max-lg:pt-20 min-h-screen">
        {isLoading && <LoadingSpinner size="lg" />}
        {queryError && <Text>Error en la compra, intenta de nuevo</Text>}
        {Boolean(product || reportDataForCheckout) && (
          <div className="mx-auto flex flex-col lg:flex-row lg:row-0 lg:grid lg:grid-cols-2 mb-10 w-full w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
            <PurchaseDetails
              product={product}
              reportData={reportDataForCheckout}
              success={success}
              pending={pending}
              onCloseSuccess={() => setSuccess(false)}
              onClosePending={() => setPending(false)}
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
      </main>
    </>
  );
};
