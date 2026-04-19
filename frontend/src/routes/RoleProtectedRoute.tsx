import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@features/auth/hooks/useAuth';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};
