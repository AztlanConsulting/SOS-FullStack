import LoadingSpinner from '@shared/components/ui/LoadingSpinner';
import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';
import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface Props {
  query: UseQueryResult;
}

const ProductDetail = ({ query }: Props) => {
  const { isLoading, error, data } = query;

  let product: Product | null = null;
  if (data) {
    // @ts-ignore
    product = data[Object.keys(data)[0]];
  }

  return (
    <div className="md:h-full h-5/6 w-10/12 mx-auto mt-3 mb-3 md:mb-0 rounded-c bg-secondary p-4">
      {isLoading && <LoadingSpinner size="lg" />}
      {error && (
        <Text color="text-red-600">
          Error: No se pudo cargar información del artículo seleccionado
        </Text>
      )}
      {(data as Object) && (
        <div className="flex flex-col items-center md:gap-3 gap-1">
          <img src={product?.imageUrl} className="rounded-c" />
          <Text variant="h3" weight="semibold">
            {product?.name}
          </Text>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
