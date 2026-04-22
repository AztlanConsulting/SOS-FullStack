import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';

interface Props {
  product: Product;
}

const ProductDetail = ({ product }: Props) => {
  return (
    <>
      <img src={product.imageUrl} className="rounded-c" />
      <Text variant="h3" weight="semibold">
        {product?.name}
      </Text>
    </>
  );
};

export default ProductDetail;
