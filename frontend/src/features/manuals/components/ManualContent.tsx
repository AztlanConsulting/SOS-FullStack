import { Text } from '@shared/components/ui/Text/Text';
import ContentRenderer from '@shared/components/ui/ContentRenderer';
import { Button } from '@shared/components/ui/Button/Button';
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
            <div className="relative w-5/6 md:place-self-start md:w-5/6 mt-6 bg-white rounded-lg">
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
