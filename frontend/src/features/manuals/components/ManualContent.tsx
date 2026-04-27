import { Text } from '@shared/components/ui/Text/Text';
import ContentRenderer from '@shared/components/ui/ContentRenderer';
import { Button } from '@shared/components/ui/Button/Button';
import { Input } from '@shared/components/ui/Input/Input';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import { useManualPurchase } from '../hooks/useManualPurchase';
import type { Manual } from '../types/Manual.type';

export const ManualContent = ({
  manual,
  onBack,
}: {
  manual: Manual;
  onBack?: () => void;
}) => {
  const { userEmail, emailError, handleEmailChange, handleProceedToPayment } =
    useManualPurchase({
      _id: manual._id,
      price: manual.price,
    });

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start">
      <HeaderBack name="Manuales" onBack={onBack} />
      <div className="color-secondary-bg w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 items-center md:py-8 color-secondary-bg w-full md:mx-auto md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
          <div className="pt-8 md:pt-0 md:row-span-2 mx-auto w-5/6 md:w-full">
            <img
              src={manual.imageUrl}
              alt={manual.name}
              className="color-grey-border rounded-lg w-full h-50 sm:h-80 md:h-90 object-cover"
            />
          </div>
          <div className="mx-auto w-5/6 md:w-full pb-8 md:pb-0">
            <Text
              as="h2"
              variant="h2"
              weight="medium"
              color="text-black"
              className="py-5 w-full"
            >
              {manual.name}
            </Text>
            <div className="w-full flex justify-start items-center">
              <Text as="h1" variant="h1" weight="medium" color="text-black">
                $ {manual.price}
              </Text>
            </div>
          </div>
          <div
            className="w-full bg-white md:bg-(--color-secondary) flex flex-col md:mt-1
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
              Te enviaremos el manual por tu correo electrónico después de la
              compra.
            </Text>
            <div className="relative w-5/6 md:w-full md:max-w-lg mx-auto md:place-self-start mt-6">
              <Input
                type="email"
                id="email"
                label="Correo electrónico"
                placeholder=" "
                value={userEmail}
                onChange={(event) => handleEmailChange(event.target.value)}
              />
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
                textColor="text-black"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p py-10 bg-white flex items-center justify-center">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-2xl xl:max-w-2xl flex flex-col gap-6">
          <ContentRenderer content={manual.content} />
        </div>
      </div>
    </section>
  );
};
