import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface Props {
  product: Product;
}

const ProductDetail = ({ product }: Props) => {
  return (
    <div className="w-10/12 mx-auto mt-3 mb-3 md:mb-0 rounded-c bg-secondary p-4 py-6">
      <div className="flex flex-col items-center md:gap-3 gap-1">
        <img src={product.imageUrl} className="rounded-c" />
        <Text variant="h3" weight="semibold">
          {product?.name}
        </Text>
      </div>
    </div>
  );
};

export default ProductDetail;
