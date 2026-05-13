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
        <div
          className="p-6 overflow-y-auto overflow-x-hidden flex flex-col items-center"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#a8aaad #eaecef',
          }}
        >
          <img src={success} alt="Success" className="w-14 mb-4" />

          <Text
            variant="h3"
            weight="bold"
            className="text-center text-gray-900 mb-8"
          >
            {plan ? '¡Todo listo!' : '¡Compra exitosa!'}
          </Text>

          {plan ? (
            <div className="w-full mb-6">
              <Text variant="body" className="text-gray-600 mb-4 block">
                Tu anuncio será publicado en unos minutos. Por favor,
                <strong> inicia sesión</strong> con la cuenta de abajo. También
                te enviamos un correo con tus credenciales y los enlaces a tus
                publicaciones en nuestras redes sociales.
              </Text>

              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-left">
                <Text
                  variant="small"
                  className="text-gray-400 uppercase text-[10px] font-bold mb-2 block"
                >
                  Datos de tu nueva cuenta:
                </Text>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-mono font-medium text-gray-800">
                      {plan.email}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contraseña:</span>
                    <span className="font-mono font-medium text-gray-800">
                      {plan.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Text
              variant="body"
              className="text-gray-600 mb-6 text-sm leading-snug"
            >
              Gracias por tu compra.{' '}
              <strong>
                Los detalles de la compra se han enviado a tu correo.
              </strong>
            </Text>
          )}

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
