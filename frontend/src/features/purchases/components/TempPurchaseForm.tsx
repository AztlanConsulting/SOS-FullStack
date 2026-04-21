import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';
import { useCreatePurchase } from '../hooks/useCreatePurchase';
import type { TempPurchase } from '../types/TempPurchase.type';
import PurchaseForm from './PurchaseForm';
import Header from '@shared/components/layout/Header';
import PurchaseDetails from './PurhcaseDetails';

// This is a temporary component to test the purchase flow.
// It will be removed once the purchase flow is implemented.

const paymentId = 'pi_1234567890';

export const TempPurchaseForm = ({
  userEmail,
  productId,
  productType,
  price,
}: TempPurchase) => {
  const { status, message, error, createPurchaseRequest } = useCreatePurchase({
    userEmail,
    paymentId,
    productId,
    productType,
  });

  return (
    <>
      <Header />
      <main className="max-md:pt-24 pt-4 grid sm:grid-cols-2 grid-rows-2">
        <PurchaseDetails />
        <PurchaseForm />
      </main>
    </>
  );

  return (
    <div className="flex flex-col items-center">
      <Text
        as="h3"
        variant="h3"
        weight="medium"
        color="text-black"
        className="pt-6 w-5/6"
      >
        Temp Purchase Form
      </Text>
      <Text
        as="p"
        variant="body"
        weight="regular"
        color="text-black"
        className="pt-6 w-5/6"
      >
        Email: {userEmail}
      </Text>
      <Text
        as="p"
        variant="body"
        weight="regular"
        color="text-black"
        className="pt-6 w-5/6"
      >
        Product: {productId}
      </Text>
      <Text
        as="p"
        variant="body"
        weight="regular"
        color="text-black"
        className="pt-6 w-5/6"
      >
        Type: {productType}
      </Text>
      <Text
        as="p"
        variant="body"
        weight="regular"
        color="text-black"
        className="pt-6 w-5/6"
      >
        Price: ${price}
      </Text>
      <Text
        as="p"
        variant="body"
        weight="regular"
        color="text-black"
        className="pt-6 w-5/6"
      >
        PaymentId: {paymentId}
      </Text>
      <div className="pt-6 flex flex-col items-center gap-3 w-full">
        <Button
          label={status === 'loading' ? 'Procesando...' : 'Confirmar compra'}
          variant="primary"
          onClick={createPurchaseRequest}
          disabled={status === 'loading'}
        />
        <Text
          as="p"
          variant="body"
          weight="regular"
          color={status === 'error' ? 'text-black' : 'text-black'}
          className="w-5/6"
        >
          Estado: {status}
        </Text>
        {status === 'success' && message && (
          <Text
            as="p"
            variant="body"
            weight="regular"
            color="text-black"
            className="w-5/6"
          >
            {message}
          </Text>
        )}
        {status === 'error' && error && (
          <Text
            as="p"
            variant="body"
            weight="regular"
            color="text-black"
            className="w-5/6"
          >
            {error}
          </Text>
        )}
      </div>
    </div>
  );
};
