import { Outlet } from 'react-router';
import { AuthProvider } from '@features/auth/hooks/AuthProvider';

export const App = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};
