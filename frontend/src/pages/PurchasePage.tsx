import { Text } from '@shared/components/ui/Text/Text';
import PurchaseForm from '../features/purchases/components/PurchaseForm';
import Header from '@shared/components/layout/Header';
import PurchaseDetails from '../features/purchases/components/PurhcaseDetails';
import { useQuery } from '@tanstack/react-query';
import getProductImage from '../features/purchases/services/getProductImage.service';
import { useLocation } from 'react-router';
import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { useState } from 'react';
import Footer from '@shared/components/layout/Footer';
import type { PurchaseDetail } from '@features/payment/types/payment.types';

// Container for purchase information and purchase logic
export const PurchasePage = () => {
  const { state } = useLocation();

  const { productId, productType, userEmail } = state;
  const [success, setSuccess] = useState(false);
  const query = useQuery({
    queryKey: ['img'],
    queryFn: async () => await getProductImage(productType, productId),
  });
  // const { status, message, error, createPurchaseRequest } = useCreatePurchase({
  //   userEmail,
  //   paymentId,
  //   productId,
  //   productType,
  // });

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
        {product && (
          <div className="grid sm:grid-cols-2 grid-rows-2 mb-10">
            <PurchaseDetails product={product} success={success} />
            <PurchaseForm
              product={product}
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
