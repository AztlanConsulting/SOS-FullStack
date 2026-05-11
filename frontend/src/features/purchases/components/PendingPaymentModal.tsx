import type { LostPetReportData } from '@/shared/types/petReport.types';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';
import { useNavigate } from 'react-router';
import pending from '@assets/images/pending.png';

interface Props {
  plan: LostPetReportData | null;
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
      className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4"
      onClick={close}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Shrink-0 prevents squashing */}
        <div className="bg-[#F9CD48] px-5 py-3 border-b border-black/10 shrink-0">
          <Text
            variant="body"
            weight="regular"
            className="text-white text-center tracking-tight"
          >
            Trámite en proceso
          </Text>
        </div>

        {/* Content area with internal scroll if height is restricted */}
        <div className="p-6 overflow-y-auto flex flex-col items-center">
          <img src={pending} alt="pending" className="w-14 mb-4" />

          <Text
            variant="h3"
            weight="bold"
            className="text-center text-gray-900 mb-2"
          >
            ¡Ya casi está listo!
          </Text>

          <Text
            variant="body"
            className="text-gray-600 text-center mb-4 text-sm leading-snug"
          >
            Tu orden ha sido registrada.{' '}
            <strong>Ya puedes cerrar esta ventana.</strong> Te enviamos los
            detalles a tu correo.
          </Text>

          {/* Summary Box - Condensed spacing */}
          <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6 text-sm">
            {plan && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs uppercase font-medium">
                    Plan
                  </span>
                  <span className="font-semibold text-gray-900">
                    {plan.planName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Cobertura</span>
                  <span className="font-semibold text-gray-900">
                    {plan.planDetails!.km} km
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Vigencia</span>
                  <span className="font-semibold text-gray-900">
                    {plan.planDetails!.days} días
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Precio</span>
                  <span className="font-semibold text-gray-900">
                    ${plan.planDetails!.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {product && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs uppercase font-medium">
                  Producto
                </span>
                <span className="font-semibold text-gray-900 text-right">
                  {product.name} (${product.price})
                </span>
              </div>
            )}
          </div>

          <Button onClick={close} label="Entendido" variant="primary" />
        </div>
      </div>
    </section>
  );
};

export default PendingPaymentModal;
