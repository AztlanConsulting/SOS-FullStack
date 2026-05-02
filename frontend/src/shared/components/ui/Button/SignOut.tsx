import { Text } from '../Text';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { TbLogout } from 'react-icons/tb';

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

const ExpandedSignOut = (setIsMenuOpen: (b: boolean) => void) => {
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

export default { desktop: SignOut, mobile: ExpandedSignOut };
