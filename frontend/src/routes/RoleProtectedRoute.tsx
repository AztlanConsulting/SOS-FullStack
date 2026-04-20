import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@features/auth/hooks/useAuth';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

/**
 * RoleProtectedRoute
 *
 * Route guard that enforces authentication and role-based authorization
 * before allowing access to protected routes.
 */
export const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) return <p>Loading...</p>;

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Unauthorized role → forbidden page
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};
