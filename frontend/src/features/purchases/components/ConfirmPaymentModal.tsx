import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import type { Plan, Product } from '@shared/types/purchase.types';
import { useNavigate } from 'react-router';

interface Props {
  plan?: Plan;
  product?: Product;
}

const ConfirmPaymentModal = ({ plan, product }: Props) => {
  const navigate = useNavigate();

  function close() {
    navigate('/');
  }

  return (
    <section
      className="fixed top-0 left-0 h-screen w-screen bg-gray-800/50 flex items-center justify-center z-10"
      onClick={close}
    >
      <div className="rounded-c bg-primary flex items-center h-68 ">
        <div className="bg-white h-56 flex flex-col gap-5 p-5">
          <Text variant="h1" className="text-center">
            ¡
            {plan
              ? 'Su anuncio será publicado en unos minutos'
              : 'La compra ha sido exitosa'}{' '}
            !
          </Text>
          {plan && (
            <Text className="text-start">
              Tipo de plan: {plan.planType} <br />
              Duración: {plan.duration} <br />
              Distancia: {plan.distance}
            </Text>
          )}
          {product && (
            <Text className="text-start">
              Producto: {product.name} <br />
              Precio: ${product.price}
            </Text>
          )}
          <div className="w-full flex justify-center">
            <Button onClick={close} label={'Cerrar'} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmPaymentModal;
