import ContentRenderer from '@shared/components/ui/ContentRenderer';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import usePurchaseProduct from '@shared/hooks/usePurchaseProduct';
import ProductPageHero from '@shared/components/layout/ProductPageHero';
import ProductSale from '@shared/components/ui/ProductSale';
import type { Manual } from '../types/Manual.type';

export const ManualContent = ({
  manual,
  onBack,
}: {
  manual: Manual;
  onBack?: () => void;
}) => {
  const purchaseData = usePurchaseProduct({
    _id: manual._id,
    item: 'manual',
    price: manual.price,
    url: 'manual',
  });

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start">
      <HeaderBack name="Manuales" onBack={onBack} />
      <div className="color-secondary-bg w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 items-center md:py-8 color-secondary-bg w-full md:mx-auto md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
          <ProductPageHero product={manual} />
          <ProductSale purchaseData={purchaseData} product={manual} />
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
