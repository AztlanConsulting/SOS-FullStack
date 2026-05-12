import type { LostPetReportData } from '@/shared/types/petReport.types';
import { Button } from '@shared/components/ui/Button';
import { Text } from '@shared/components/ui/Text';
import type { Product } from '@shared/types/purchase.types';
import { useNavigate } from 'react-router';
import success from '@assets/images/success.png';

interface Props {
  plan: LostPetReportData | null;
  product?: Product;
  onClose?: () => void;
}

const ConfirmPaymentModal = ({ plan, product, onClose }: Props) => {
  const navigate = useNavigate();

  function close() {
    if (onClose) onClose();
    window.scrollTo(0, 0);
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
        {/* Header - Compact */}
        <div className="bg-[#F9CD48] px-5 py-3 border-b border-black/10 shrink-0">
          <Text
            variant="body"
            weight="regular"
            className="text-white text-center tracking-tight"
          >
            Pago confirmado
          </Text>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto flex flex-col items-center">
          <img src={success} alt="Success" className="w-14 mb-4" />

          <Text
            variant="h3"
            weight="bold"
            className="text-center text-gray-900 mb-8"
          >
            {plan ? '¡Todo listo!' : '¡Compra exitosa!'}
          </Text>

          <Text
            variant="body"
            className="text-gray-600 mb-6 text-sm leading-snug"
          >
            {plan ? (
              'Tu anuncio será publicado en unos minutos.'
            ) : (
              <>
                Gracias por tu compra.{' '}
                <strong>
                  Los detalles de la compra se han enviado a tu correo.
                </strong>
              </>
            )}
          </Text>

          {/* Details Card - Thinner Padding */}
          <div className="w-full bg-green-50/50 rounded-lg p-4 border border-green-100 mb-6 text-sm">
            <Text
              variant="small"
              weight="bold"
              className="text-green-800 uppercase text-[10px] tracking-widest mb-2 block"
            >
              Resumen de orden
            </Text>

            {plan && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Plan</span>
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
                <span className="text-gray-500">Producto</span>
                <span className="font-semibold text-gray-900">
                  {product.name} (${product.price})
                </span>
              </div>
            )}
          </div>

          <Button onClick={close} label="Ir al Inicio" variant="primary" />
        </div>
      </div>
    </section>
  );
};

export default ConfirmPaymentModal;
