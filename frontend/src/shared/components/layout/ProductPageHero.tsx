import type { Product } from '@shared/types/purchase.types';
import { Text } from '../ui/Text';

const ProductPageHero = ({ product }: Product) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 bg-secondary md:w-1/2">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="color-grey-border rounded-lg w-5/6"
      />
      <Text
        as="h3"
        variant="h3"
        weight="regular"
        color="text-black"
        className="py-5 w-5/6"
      >
        {product.name}
      </Text>
      <div className="w-5/6 flex justify-between items-center">
        <Text as="p" variant="body" weight="regular" color="text-black">
          Precio
        </Text>
        <Text as="h3" variant="h3" weight="medium" color="text-black">
          $ {product.price}
        </Text>
      </div>
    </div>
  );
};

export default ProductPageHero;
