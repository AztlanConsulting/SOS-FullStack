import { Button } from './Button/Button';
import { Text } from './Text';

interface PurchaseData {
  purchaseData: {
    userEmail: string;
    emailError: string;
    handleEmailChange: (email: string) => void;
    handleProceedToPayment: () => void;
  };
}

const ProductSale = ({ purchaseData }: PurchaseData) => {
  const userEmail = purchaseData.userEmail;
  const emailError = purchaseData.emailError;
  const handleEmailChange = purchaseData.handleEmailChange;
  const handleProceedToPayment = purchaseData.handleProceedToPayment;

  return (
    <div className="md:w-1/2 pb-10 flex flex-col items-center justify-center color-grey-border-top color-grey-border-bottom shadow-xl/30">
      <Text
        as="h3"
        variant="h3"
        weight="medium"
        color="text-black"
        className="pt-8"
      >
        Contacto
      </Text>
      <Text
        as="p"
        variant="caption"
        weight="regular"
        color="color-grey-text"
        className="w-5/6 pt-5"
      >
        Te enviaremos el manual por tu correo electrónico después de la compra.
      </Text>
      <div className="relative w-5/6 mt-10 bg-white rounded-lg">
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
          className="w-5/6 pl-4 pt-1"
        >
          {emailError}
        </Text>
      )}
      <div className="w-full flex justify-center items-center mt-10">
        <Button
          label="Proceder al pago"
          variant="primary"
          onClick={handleProceedToPayment}
        />
      </div>
    </div>
  );
};

export default ProductSale;
