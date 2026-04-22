import type { Product } from '@shared/types/purchase.types';

interface Props {
  product: Product;
}

const ProductPageHero = ({ product }: Props) => {
  return (
    <div className="pt-0 md:pt-0 md:row-span-2 mx-auto w-full md:w-full">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="color-grey-border rounded-lg w-full h-50 sm:h-80 md:h-90 object-cover"
      />
    </div>
  );
};

export default ProductPageHero;
