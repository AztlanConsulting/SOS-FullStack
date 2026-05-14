import { Outlet } from 'react-router';
import { AuthProvider } from '@features/auth/hooks/AuthProvider';
import { LocationProvider } from '@shared/context/Location.context';

export const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <Outlet />
      </LocationProvider>
    </AuthProvider>
  );
};
