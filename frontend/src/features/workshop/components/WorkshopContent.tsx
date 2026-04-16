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
      <div className="md:flex">
        <ProductPageHero product={workshop} />
        <ProductSale purchaseData={purchaseData} />
      </div>
      <div className="w-full p py-8 bg-white flex items-center justify-center">
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-black"
          className="w-5/6"
        >
          {workshop.content}
        </Text>
      </div>
    </section>
  );
};

export default WorkshopContent;
