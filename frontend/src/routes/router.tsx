import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import { TempPurchasePage } from '../pages/TempPurchasePage';
import LandingPage from '../pages/LandingPage';
import CreditsPage from '../pages/CreditsPage';
import Therms from '../pages/Therms';
import routerWorkshop from './workshop.routes';
import routerPlans from './plan.routes';
import routerManuals from './manual.routes';
import LoginPage from '../pages/LoginPage';
import { Dashboard } from '@features/auth/components/TempDashboard';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import path from 'path/win32';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/dashboard',
        element: (
          <RoleProtectedRoute
            allowedRoles={['69e3bea8c23bd1f51afce0de', 'user']}
          >
            <Dashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/purchase',
        element: <TempPurchasePage />,
      },
      {
        path: '/credits',
        element: <CreditsPage />,
      },
      {
        path: '/therms',
        element: <Therms />,
      },
      ...routerWorkshop,
      ...routerPlans,
      ...routerManuals,
    ],
  },
]);

export default router;
