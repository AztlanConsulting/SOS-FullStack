import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';

interface Props {
  product: Product;
}

const ProductDetail = ({ product }: Props) => {
  return (
    <>
      {product.imageUrl ? (
        <img
          loading="lazy"
          src={product.imageUrl}
          className="rounded-lg w-full h-60 object-cover"
        />
      ) : (
        <div className="w-10/12">
          <ul>
            <Row label={'Plan seleccionado'} value={product.name} />
            <Row
              label={'Duración'}
              value={String(product.duration) + ' días'}
            />
            <Row label={'Distancia'} value={String(product.radius) + ' km'} />
          </ul>
        </div>
      )}
    </>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="w-full flex justify-between">
      <Text color={'text-gray-800'}>{label}</Text>
      <Text weight="semibold" color={'text-gray-800'}>
        {value}
      </Text>
    </li>
  );
}

export default ProductDetail;
