import { Navigate } from 'react-router';
import { LoginForm } from '@features/auth/components/LoginForm';
import { useAuth } from '@features/auth/hooks/useAuth';

const LoginPage = () => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) return <p>Loading...</p>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
