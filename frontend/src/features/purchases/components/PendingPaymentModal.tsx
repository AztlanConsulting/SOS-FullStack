import type { PetReportData } from '@/features/users/types/petReport.types';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';
import { useNavigate } from 'react-router';

interface Props {
  plan: PetReportData | null;
  product?: Product;
  onClose?: () => void;
}

const PendingPaymentModal = ({ plan, product, onClose }: Props) => {
  const navigate = useNavigate();

  function close() {
    if (onClose) onClose();
    navigate('/');
  }

  return (
    <section
      className="fixed top-0 left-0 h-screen w-screen bg-gray-800/50 flex items-center justify-center z-10"
      onClick={close}
      id="dialog"
    >
      <div className="rounded-c bg-primary flex items-center h-68 ">
        <div className="bg-white h-56 flex flex-col gap-5 p-5">
          <Text variant="h1" className="text-center">
            En cuanto el pago se procese, le mandaremos un correo de
            confirmación{' '}
          </Text>
          {plan && (
            <Text className="text-start">
              Tipo de plan: {plan.planName} <br />
              Duración: {plan.planDetails!.days} <br />
              Distancia: {plan.planDetails!.km}
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

export default PendingPaymentModal;
