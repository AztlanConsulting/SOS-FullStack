import { Text } from '@shared/components/ui/Text';
import type { Workshop } from '../types/workshop';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import usePurchaseProduct from '@shared/hooks/usePurchaseProduct';
import ProductPageHero from '@shared/components/layout/ProductPageHero';
import ProductSale from '@shared/components/ui/ProductSale';

interface Props {
  workshop: Workshop;
}

const WorkshopContent = ({ workshop }: Props) => {
  const purchaseData = usePurchaseProduct({
    _id: workshop._id,
    item: 'taller',
    price: workshop.price,
    url: 'workshop',
  });

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start">
      <HeaderBack name="Talleres" />
      <div className="bg-secondary w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 items-center md:py-8 color-secondary-bg w-full md:mx-auto md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
          <ProductPageHero product={workshop} />
          <ProductSale purchaseData={purchaseData} product={workshop} />
        </div>
      </div>
      <div className="w-full p py-10 bg-white flex items-center justify-center">
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-black"
          className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl"
        >
          {workshop.content}
        </Text>
      </div>
    </section>
  );
};

export default WorkshopContent;
