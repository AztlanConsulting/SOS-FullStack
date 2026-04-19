import type { Product } from '@shared/types/purchase.types';
import { Button } from './Button/Button';
import { Text } from './Text';

interface PurchaseData {
  purchaseData: {
    userEmail: string;
    emailError: string;
    handleEmailChange: (email: string) => void;
    handleProceedToPayment: () => void;
  };
  product: Product;
}

const ProductSale = ({ purchaseData, product }: PurchaseData) => {
  const userEmail = purchaseData.userEmail;
  const emailError = purchaseData.emailError;
  const handleEmailChange = purchaseData.handleEmailChange;
  const handleProceedToPayment = purchaseData.handleProceedToPayment;

  return (
    <>
      <div className="mx-auto w-5/6 md:w-full pb-8 md:pb-0">
        <Text
          as="h2"
          variant="h2"
          weight="medium"
          color="text-black"
          className="py-5 w-full"
        >
          {product.name}
        </Text>
        <div className="w-full flex justify-start items-center">
          <Text as="h1" variant="h1" weight="medium" color="text-black">
            $ {product.price}
          </Text>
        </div>
      </div>
      <div
        className="w-full bg-white md:bg-secondary flex flex-col md:mt-1
      items-center justify-center border-b border-secondary shadow-xl/30 md:border-none md:shadow-none"
      >
        <Text
          as="p"
          variant="body"
          weight="medium"
          color="text-black"
          className="py-4 w-5/6 text-center md:w-full md:text-left"
        >
          Contacto
        </Text>
        <Text
          as="p"
          variant="caption"
          weight="regular"
          color="color-grey-text"
          className="w-5/6 md:w-full"
        >
          Te enviaremos el manual por tu correo electrónico después de la
          compra.
        </Text>
        <div className="relative w-5/6 md:place-self-start md:w-5/6 mt-6 bg-white rounded-lg">
          <input
            type="email"
            id="email"
            placeholder=" "
            value={userEmail}
            onChange={(event) => handleEmailChange(event.target.value)}
            className="peer w-full rounded-lg border border-(--color-grey-border) 
          px-4 pt-5 pb-2 text-sm focus:border-(--color-primary) 
          focus:outline-none text-black
          "
          />

          <label
            htmlFor="email"
            className="
          absolute left-4 top-0.5 text-sm text-gray-500
          pointer-events-none transition-colors
          peer-focus:text-(--color-primary)
          "
          >
            Correo electrónico
          </label>
        </div>
        {emailError && (
          <Text
            as="p"
            variant="caption"
            weight="regular"
            color="color-danger"
            className="w-5/6 pl-4 md:place-self-start pt-1"
          >
            {emailError}
          </Text>
        )}
        <div className="w-full flex justify-center items-center md:justify-start mt-6 mb-8">
          <Button
            label="Proceder al pago"
            variant="primary"
            onClick={handleProceedToPayment}
          />
        </div>
      </div>
    </>
  );
};

export default ProductSale;
