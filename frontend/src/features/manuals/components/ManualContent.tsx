import { Text } from '@shared/components/ui/Text/Text';
import { Button } from '@shared/components/ui/Button/Button';
import { HeaderBack } from '@shared/components/layout/HeaderBack';

export const ManualContent = ({ manual }: { manual: any }) => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-start">
      <HeaderBack name="Manuales" />
      <div className="flex flex-col items-center justify-center w-5/6 py-8 color-secondary-bg">
        <img
          src={manual.imageUrl}
          alt={manual.title}
          className="w-full color-grey-border rounded-lg"
        />
        <Text
          as="h3"
          variant="h3"
          weight="regular"
          color="text-black"
          className="w-full py-5"
        >
          {manual.name}
        </Text>
        <div className="w-full flex justify-between items-center">
          <Text as="h3" variant="h3" weight="regular" color="text-black">
            Precio
          </Text>
          <Text as="h3" variant="h3" weight="medium" color="text-black">
            $ {manual.price}
          </Text>
        </div>
      </div>
      <div className="w-full p py-4 flex items-center justify-center color-grey-border-top">
        <Button
          label="Comprar"
          variant="primary"
          onClick={() => <ManualContent manual={manual} />}
        />
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
