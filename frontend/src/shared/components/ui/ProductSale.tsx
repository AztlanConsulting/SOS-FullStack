import type { Product } from '@shared/types/purchase.types';
import { Button } from './Button/Button';
import { Text } from './Text';
import { Input } from './Input/Input';

interface PurchaseData {
  purchaseData: {
    userEmail: string;
    emailError: string;
    userName: string;
    nameError: string;
    handleEmailChange: (email: string) => void;
    handleNameChange: (name: string) => void;
    handleProceedToPayment: () => void;
  };
  product: Product;
}

const ProductSale = ({ purchaseData, product }: PurchaseData) => {
  const userEmail = purchaseData.userEmail;
  const emailError = purchaseData.emailError;
  const userName = purchaseData.userName;
  const nameError = purchaseData.nameError;
  const handleEmailChange = purchaseData.handleEmailChange;
  const handleNameChange = purchaseData.handleNameChange;
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
      items-center justify-center border-b border-[var(--color-grey-border)] shadow-xl/30 md:border-none md:shadow-none"
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
          Te enviaremos los detalles de tu compra por correo electrónico después
          de completar el pago.
        </Text>
        <div className="relative flex flex-col gap-3 w-5/6 md:w-full md:max-w-lg mx-auto md:place-self-start mt-6 color-secondary-bg rounded-lg">
          <Input
            type="name"
            id="name"
            label="Nombre"
            placeholder=" "
            hasLength={false}
            error={nameError}
            value={userName}
            onChange={(event) => handleNameChange(event.target.value)}
          />
          <Input
            type="email"
            id="email"
            label="Correo electrónico"
            placeholder=" "
            hasLength={false}
            error={emailError}
            value={userEmail}
            onChange={(event) => handleEmailChange(event.target.value)}
          />
        </div>
        <div className="flex justify-center items-center md:justify-start mt-6 mb-8 w-5/6 md:w-full md:max-w-lg mx-auto">
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
