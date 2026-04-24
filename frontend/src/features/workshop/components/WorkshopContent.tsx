import ContentRenderer from '@shared/components/ui/ContentRenderer';
import type { Workshop } from '../types/workshop';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import usePurchaseProduct from '@shared/hooks/usePurchaseProduct';
import ProductPageHero from '@shared/components/layout/ProductPageHero';
import ProductSale from '@shared/components/ui/ProductSale';

interface Props {
  workshop: Workshop;
  onBack?: () => void;
}

const WorkshopContent = ({ workshop, onBack }: Props) => {
  const purchaseData = usePurchaseProduct({
    _id: workshop._id,
    item: 'taller',
    price: workshop.price,
    url: 'workshop',
  });

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start">
      <HeaderBack name="Talleres" onBack={onBack} />
      <div className="bg-secondary w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 items-center md:py-8 color-secondary-bg w-full md:mx-auto md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
          <ProductPageHero product={workshop} />
          <ProductSale purchaseData={purchaseData} product={workshop} />
        </div>
      </div>
      <div className="w-full p py-10 bg-white flex items-center justify-center">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-2xl xl:max-w-2xl flex flex-col gap-6">
          <ContentRenderer content={workshop.content} />
        </div>
      </div>
    </section>
  );
};

export default WorkshopContent;
