import { usePetReport } from '@/shared/context/PetReportContext';
import type { Product } from '@/shared/types/purchase.types';
import { useEffect, useState } from 'react';
import usePurchase from './usePurchase';
import { useNavigate, useSearchParams } from 'react-router';
import { useLocationContext } from '@/shared/context/Location.context';
import type { LostPetReportData } from '@/shared/types/petReport.types';

function usePurchasePage() {
  // Initialize information and state
  const successHook = useState(false);
  const pendingHook = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const { lostPetReportData } = usePetReport();
  const { state, query } = usePurchase();
  const navigate = useNavigate();
  const [queryParams, _] = useSearchParams();
  const { exchangeRate } = useLocationContext();

  const { productId, productType, selectedPlan } = state ?? {};

  const [_success, setSuccess] = successHook;
  const { data } = query;
  const isPlanExtension = productType === 'plan-extension';
  const [reportDataForCheckout, setReportDataForCheckout] =
    useState<LostPetReportData | null>(
      isPlanExtension ? null : lostPetReportData,
    );

  // Construct product for use in application in common structure
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
    console.log(reportDataForCheckout, product);
    if (reportDataForCheckout && product) {
      console.log('Store');
      // Store purchase information for paypal purchase flow
      sessionStorage.setItem(
        'checkoutData',
        JSON.stringify({
          reportDataForCheckout,
          product,
        }),
      );
    }
  }, [product]);

  // Redirect when needed
  useEffect(() => {
    if (
      !Boolean(state) &&
      !Boolean(reportDataForCheckout) &&
      !queryParams.get('token')
    ) {
      navigate('/');
    }
    if (queryParams.get('token')) {
      setSuccess(true);
      const checkoutData = sessionStorage.getItem('checkoutData');

      const cachedData = checkoutData ? JSON.parse(checkoutData) : null;

      setReportDataForCheckout(
        cachedData?.reportDataForCheckout ?? lostPetReportData,
      );

      setProduct(cachedData?.product);
    }
    // console.log(queryParams)
  }, [state, reportDataForCheckout]);

  return {
    state,
    successHook,
    pendingHook,
    query,
    lostPetReportData,
    product,
  };
}

export default usePurchasePage;
