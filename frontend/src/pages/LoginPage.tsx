import { Navigate } from 'react-router';
import { LoginForm } from '@features/auth/components/LoginForm';
import { useAuth } from '@features/auth/hooks/useAuth';
import roleNavigation from '@/shared/utils/roleNavigation';

const LoginPage = () => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) return <p>Loading...</p>;

  if (user) {
    return <Navigate to={roleNavigation(user.role)} replace />;
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
