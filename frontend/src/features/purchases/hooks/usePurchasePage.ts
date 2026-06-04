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
    if (queryParams.get('token')) return;

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
      console.log('Set product - Construct product for use in application IF');

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
    if (reportDataForCheckout || product) {
      // Store purchase information for paypal purchase flow
      sessionStorage.setItem(
        'checkoutData',
        JSON.stringify({
          reportDataForCheckout,
          product,
        }),
      );
    } else {
      console.log('Error: No product or report');
    }
  }, [product]);

  // Redirect when needed
  useEffect(() => {
    if (!queryParams.get('token')) return;

    setSuccess(true);

    const checkoutData = sessionStorage.getItem('checkoutData');
    const cachedData = checkoutData ? JSON.parse(checkoutData) : null;

    setReportDataForCheckout(
      cachedData?.reportDataForCheckout ?? lostPetReportData,
    );

    setProduct(cachedData?.product);
  }, []);

  useEffect(() => {
    if (!state && !reportDataForCheckout && !queryParams.get('token')) {
      navigate('/');
    }
  }, [state, reportDataForCheckout, navigate, queryParams]);

  function navigateHome() {
    navigate('/');
  }

  return {
    state,
    successHook,
    pendingHook,
    query,
    lostPetReportData,
    product,
    reportDataForCheckout,
    navigateHome,
  };
}

export default usePurchasePage;
