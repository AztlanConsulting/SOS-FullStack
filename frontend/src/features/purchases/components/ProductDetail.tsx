import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';

interface Props {
  product: Product;
}

const ProductDetail = ({ product }: Props) => {
  return (
    <>
      <img
        src={product.imageUrl}
        className="rounded-lg w-full h-60 object-cover"
      />
      <Text variant="body" weight="regular" className="w-full">
        {product?.name}
      </Text>
    </>
  );
};

export default ProductDetail;
