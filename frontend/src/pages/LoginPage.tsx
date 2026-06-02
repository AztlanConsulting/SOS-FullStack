import { Navigate, useNavigate } from 'react-router';
import { LoginForm } from '@features/auth/components/LoginForm';
import { useAuth } from '@features/auth/hooks/useAuth';
import roleNavigation from '@/shared/utils/roleNavigation';
import { HiHome } from 'react-icons/hi2';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';

const LoginPage = () => {
  const { user, isAuthLoading } = useAuth();
  const navigator = useNavigate();

  if (isAuthLoading)
    return (
      <div className="h-screen bg-secondary flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (user) {
    return <Navigate to={roleNavigation(user.role)} replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button className="top-0 h-8 my-2 w-full flex items-start justify-start">
        <HiHome
          size="100%"
          className="aspect-square text-primary w-fit ml-1 cursor-pointer"
          onClick={() => navigator('/')}
        />
      </button>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
