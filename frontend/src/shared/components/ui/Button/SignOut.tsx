import { useState } from 'react';
import { Text } from '../Text';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ExpandedProps } from '@/shared/types/header.types';
import { TbLogout } from 'react-icons/tb';
import { HiLogout } from 'react-icons/hi';
import { DecisionModal } from '@/shared/components/ui/Modal/DecisionModal';
import { useNavigate } from 'react-router';

const SignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group bg-purple-primary py-1 px-4 rounded-3xl cursor-pointer transition-colors"
      >
        <Text variant="body" weight="medium" className="text-white">
          Cerrar sesión
        </Text>
      </button>

      {isModalOpen && (
        <DecisionModal
          title="¿Deseas cerrar sesión?"
          description="Tu sesión se cerrará y tendrás que volver a iniciar sesión para continuar."
          color="purple"
          onClose={() => setIsModalOpen(false)}
          leftText="Cancelar"
          rightText="Cerrar sesión"
          onLeftAction={() => setIsModalOpen(false)}
          onRightAction={() => {
            logout();
            navigate('/');
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

const ExpandedSignOut = ({
  setIsMenuOpen,
  color = 'primary',
}: ExpandedProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalColor = color === 'purple-primary' ? 'purple' : 'yellow';

  return (
    <div className="p-9 border-t border-white">
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-start gap-4"
      >
        <TbLogout strokeWidth={1} className="w-7 h-7 text-white " />
        <Text variant="h3" weight="medium" color="text-white">
          Cerrar sesión
        </Text>
      </button>

      {isModalOpen && (
        <DecisionModal
          title="¿Deseas cerrar sesión?"
          description="Tu sesión se cerrará y tendrás que volver a iniciar sesión para continuar."
          color={modalColor}
          onClose={() => setIsModalOpen(false)}
          leftText="Cancelar"
          rightText="Cerrar sesión"
          onLeftAction={() => setIsModalOpen(false)}
          onRightAction={() => {
            logout();
            setIsMenuOpen(false);
            navigate('/');
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const WhiteStrokeSignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-primary border-2 border-white py-2 px-4 rounded-3xl cursor-pointer transition-colors hover:bg-[#C2991D]/60 w-full"
      >
        <HiLogout size={18} className="text-white" />
        <Text variant="body" weight="medium" className="text-white">
          Cerrar sesión
        </Text>
      </button>

      {isModalOpen && (
        <DecisionModal
          title="¿Deseas cerrar sesión?"
          description="Tu sesión se cerrará y tendrás que volver a iniciar sesión para continuar."
          color="yellow"
          onClose={() => setIsModalOpen(false)}
          leftText="Cancelar"
          rightText="Cerrar sesión"
          onLeftAction={() => setIsModalOpen(false)}
          onRightAction={() => {
            logout();
            navigate('/');
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default {
  desktop: SignOut,
  mobile: ExpandedSignOut,
  whiteStroke: WhiteStrokeSignOut,
};
