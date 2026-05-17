import { Navigate, useNavigate } from 'react-router';
import { LoginForm } from '@features/auth/components/LoginForm';
import { useAuth } from '@features/auth/hooks/useAuth';
import roleNavigation from '@/shared/utils/roleNavigation';
import { HiChevronLeft } from 'react-icons/hi';

const LoginPage = () => {
  const { user, isAuthLoading } = useAuth();
  const navigator = useNavigate();

  if (isAuthLoading) return <p>Loading...</p>;

  if (user) {
<<<<<<< HEAD
    return <Navigate to="/clientes" replace />;
=======
    return <Navigate to={roleNavigation(user.role)} replace />;
>>>>>>> f8193bbcb3386dcd51f79fd079f7ed6a5b68e0d7
  }

  return (
    <div>
      <button
        className="absolute top-0 h-12 w-9"
        onClick={() => navigator('/')}
      >
        <HiChevronLeft size="100%" className="aspect-square text-primary" />
      </button>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
