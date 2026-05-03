import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import LandingPage from '../pages/LandingPage';
import CreditsPage from '../pages/CreditsPage';
import Therms from '../pages/Therms';
import { ReportConfirmationPage } from '../pages/ReportConfirmation';
import { PetReportProvider } from '../features/users/context/PetReportContext';
import Plans from '../pages/Plans';
import { PaymentPage } from '../features/payment/components/PaymentPage';
import routerWorkshop from './workshop.routes';
import routerBlogs from './blog.routes';
import routerPlans from './plan.routes';
import routerManuals from './manual.routes';
import { PurchasePage } from '@pages/PurchasePage';
import routerClient from './client.routes';
import { PetReportForm } from '@features/users/components/PetReportForm';
import LoginPage from '../pages/LoginPage';
import { Dashboard } from '@features/auth/components/TempDashboard';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import ClientDashboard from '@/pages/ClientDashboard';

export const router = createBrowserRouter([
  {
    element: (
      <PetReportProvider>
        <App />
      </PetReportProvider>
    ),
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
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <Dashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/inicio',
        element: (
          <RoleProtectedRoute allowedRoles={['CLIENT']}>
            <ClientDashboard />
          </RoleProtectedRoute>
        ),
        children: [...routerClient],
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
      {
        path: '/lost-pet',
        element: <PetReportForm />,
      },
      {
        path: '/report-confirmation',
        element: <ReportConfirmationPage />,
      },
      {
        path: '/plans',
        element: <Plans />,
      },
      {
        path: '/payment',
        element: <PaymentPage />,
      },
      ...routerWorkshop,
      ...routerPlans,
      ...routerManuals,
      ...routerBlogs,
    ],
  },
]);

export default router;
