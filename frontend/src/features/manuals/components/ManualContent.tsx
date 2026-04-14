import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import { useManualPurchase } from '../hooks/useManualPurchase';

export const ManualContent = ({ manual }: { manual: any }) => {
  const { userEmail, emailError, handleEmailChange, handleProceedToPayment } =
    useManualPurchase({
      _id: manual._id as string,
      price: manual.price as number,
    });

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start">
      <HeaderBack name="Manuales" />
      <div className="flex flex-col items-center justify-center py-8 color-secondary-bg">
        <img
          src={manual.imageUrl}
          alt={manual.title}
          className="color-grey-border rounded-lg w-5/6"
        />
        <Text
          as="h3"
          variant="h3"
          weight="regular"
          color="text-black"
          className="py-5 w-5/6"
        >
          {manual.name}
        </Text>
        <div className="w-5/6 flex justify-between items-center">
          <Text as="h3" variant="h3" weight="regular" color="text-black">
            Precio
          </Text>
          <Text as="h3" variant="h3" weight="medium" color="text-black">
            $ {manual.price}
          </Text>
        </div>
      </div>
      <div className="w-full pb-10 flex flex-col items-center justify-center color-grey-border-top color-grey-border-bottom shadow-xl/30">
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
          Te enviaremos el manual por tu correo electrónico después de la
          compra.
        </Text>
        <div className="relative w-5/6 mt-10 bg-white rounded-lg">
          <input
            type="email"
            id="email"
            placeholder=" "
            value={userEmail}
            onChange={(event) => handleEmailChange(event.target.value)}
            className="peer w-full rounded-lg border border-[var(--color-grey-border)] 
                px-4 pt-5 pb-2 text-sm focus:border-[var(--color-primary)] 
                focus:outline-none text-black
                "
          />

          <label
            htmlFor="email"
            className="
                absolute left-4 top-0.5 text-sm text-gray-500
                pointer-events-none transition-colors
                peer-focus:text-[var(--color-primary)]
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
      <div className="w-full p py-8 bg-white flex items-center justify-center">
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-black"
          className="w-5/6"
        >
          {manual.content}
        </Text>
      </div>
    </section>
  );
};
