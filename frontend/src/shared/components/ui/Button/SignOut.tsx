import { Text } from '../Text';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ExpandedProps } from '@/shared/types/header.types';
import { TbLogout } from 'react-icons/tb';
import { HiLogout } from 'react-icons/hi';

const SignOut = () => {
  const { logout } = useAuth();

  return (
    <div
      onClick={logout}
      className={`group bg-purple-primary py-1 px-4 rounded-3xl cursor-pointer transition-colors `}
    >
      <Text variant="body" weight="medium" className={`text-white`}>
        Cerrar sesión
      </Text>
    </div>
  );
};

const ExpandedSignOut = ({ setIsMenuOpen }: ExpandedProps) => {
  const { logout } = useAuth();

  return (
    <div className="p-9 border-t border-white">
      <button
        onClick={() => {
          logout();
          setIsMenuOpen(false);
        }}
        className="w-full flex items-center justify-start gap-4"
      >
        <TbLogout strokeWidth={1} className="w-7 h-7 text-white " />
        <Text variant="h3" weight="medium" color="text-white">
          Cerrar sesión
        </Text>
      </button>
    </div>
  );
};

const WhiteStrokeSignOut = () => {
  const { logout } = useAuth();

  return (
    <div
      onClick={logout}
      className="flex items-center gap-2 bg-primary border-2 border-white py-2 px-4 rounded-3xl cursor-pointer transition-colors hover:bg-[#C2991D]/60"
    >
      <HiLogout size={18} className="text-white" />
      <Text variant="body" weight="medium" className="text-white">
        Cerrar sesión
      </Text>
    </div>
  );
};

export default {
  desktop: SignOut,
  mobile: ExpandedSignOut,
  whiteStroke: WhiteStrokeSignOut,
};
