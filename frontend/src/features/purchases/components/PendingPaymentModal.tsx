import type { PetReportData } from '@/features/users/types/petReport.types';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';
import { useNavigate } from 'react-router';
import pending from '@assets/images/pending.png';

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
      className="fixed top-14 lg:top-16 left-0 h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] w-screen bg-gray-800/50 flex items-center justify-center z-10"
      onClick={close}
      id="dialog"
    >
      <div className="rounded-lg flex items-center w-5/6 md:w-1/2">
        <div className="rounded-lg bg-white flex flex-col w-full">
          <div className="rounded-t-lg bg-[#F9CD48] px-5 py-4 flex items-center justify-between border-b-2 border-[#AFB1B6]">
            <Text
              variant="body"
              weight="medium"
              className="text-white flex-1 text-center"
            >
              Compra pendiente
            </Text>
          </div>
          <div className="flex flex-col gap-3 w-full px-5">
            <img
              src={pending}
              alt="pending"
              className="w-1/7 mt-5 self-center"
            />
            <Text
              variant="body"
              className="text-gray-700 leading-relaxed color-grey-border-bottom pb-5 text-center"
            >
              Te enviaremos instrucciones por correo al confirmar tu pago.
            </Text>
            {plan && (
              <>
                <Text variant="body" className="text-gray-700 leading-relaxed">
                  Tipo de plan: {plan.planName}
                </Text>
                <Text variant="body" className="text-gray-700 leading-relaxed">
                  Duración: {plan.planDetails!.days}
                </Text>
                <Text variant="body" className="text-gray-700 leading-relaxed">
                  Distancia: {plan.planDetails!.km}
                </Text>
              </>
            )}
            {product && (
              <Text variant="body" className="text-gray-700 leading-relaxed">
                Producto: {product.name} <br />
                Precio: ${product.price}
              </Text>
            )}
          </div>
          <div className="w-full flex justify-center self-center py-5 ">
            <Button onClick={close} label={'Cerrar'} variant="primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PendingPaymentModal;
