import roleNavigation from '@/shared/utils/roleNavigation';
import { useNavigate } from 'react-router';
import { Text } from '../Text';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { HiOutlineUserCircle } from 'react-icons/hi';

const SignIn = () => {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();
  const firstName = user?.username.trim().split(/\s+/)[0] ?? '';

  return (
    <div
      onClick={() => {
        if (isAuthLoading) return;
        navigate(user ? roleNavigation(user.role) : '/login');
      }}
      className={`group border-1 border-[color:var(--color-primary)] py-1 px-4 rounded-3xl cursor-pointer transition-colors ${
        user
          ? 'bg-[color:var(--color-primary)] hover:bg-white'
          : 'bg-white hover:bg-[color:var(--color-primary)]'
      }`}
    >
      <Text
        variant="body"
        weight="medium"
        className={`${
          user
            ? 'text-white group-hover:text-[color:var(--color-primary)]'
            : 'text-[color:var(--color-primary)] group-hover:text-white'
        }`}
      >
        {user ? `Hola, ${firstName}` : 'Iniciar Sesión'}
      </Text>
    </div>
  );
};

const ExpandedSignIn = (setIsMenuOpen: (b: boolean) => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.username.trim().split(/\s+/)[0] ?? '';

  return (
    <div className="p-9 border-t border-white">
      <button
        onClick={() => {
          navigate(user ? roleNavigation(user.role) : '/login');
          setIsMenuOpen(false);
        }}
        className="w-full flex items-center justify-start gap-4"
      >
        <HiOutlineUserCircle strokeWidth={1} className="w-7 h-7 text-white " />
        <Text variant="h3" weight="medium" color="text-white">
          {user ? `Hola, ${firstName}` : 'Iniciar Sesión'}
        </Text>
      </button>
    </div>
  );
};

export default { desktop: SignIn, mobile: ExpandedSignIn };
