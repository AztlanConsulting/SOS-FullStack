import { TempPurchaseForm } from '@features/purchases/components/TempPurchaseForm';
import { useLocation } from 'react-router';
import { useEffect } from 'react';

export function TempPurchasePage() {
  const { state } = useLocation();
  const productId = state?.productId as string | undefined;
  const productType = state?.productType as string | undefined;
  const price = state?.price as number | undefined;
  const userEmail = state?.userEmail as string | undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        {userEmail && productId && productType && price !== undefined ? (
          <TempPurchaseForm
            userEmail={userEmail}
            productId={productId}
            productType={productType}
            price={price}
          />
        ) : (
          <div>Error al procesar la compra.</div>
        )}
      </main>
    </div>
  );
}
