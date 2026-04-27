import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import LandingPage from '../pages/LandingPage';
import CreditsPage from '../pages/CreditsPage';
import Therms from '../pages/Therms';
import routerWorkshop from './workshop.routes';
import routerBlogs from './blog.routes';
import routerPlans from './plan.routes';
import routerManuals from './manual.routes';
import { PurchasePage } from '@pages/PurchasePage';
import LoginPage from '../pages/LoginPage';
import { Dashboard } from '@features/auth/components/TempDashboard';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ForbiddenPage } from '../pages/ForbiddenPage';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/compra',
        element: <PurchasePage />,
      },
      {
        path: '/forbidden',
        element: <ForbiddenPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/dashboard',
        element: (
          <RoleProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        element: <CreditsPage />,
      },
      {
        path: '/therms',
        element: <Therms />,
      },
      ...routerWorkshop,
      ...routerPlans,
      ...routerManuals,
      ...routerBlogs,
    ],
  },
]);

export default router;
