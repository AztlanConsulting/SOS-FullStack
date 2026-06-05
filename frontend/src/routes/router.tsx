import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import LandingPage from '../pages/LandingPage';
import CreditsPage from '../pages/CreditsPage';
import Therms from '../pages/Therms';
import { ReportConfirmationPage } from '../pages/ReportConfirmation';
import Plans from '../pages/Plans';
import routerWorkshop from './workshop.routes';
import routerBlogs from './blog.routes';
import routerPlans from './plan.routes';
import routerManuals from './manual.routes';
import routerLostPet from './foundPet.routes';
import { PurchasePage } from '@pages/PurchasePage';
import { PetReportForm } from '@features/users/components/PetReportForm';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import { Dashboard } from '@features/auth/components/TempDashboard';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import routerAdmin from './admin.routes.tsx';
import routerMembersOnly from './membersOnly.routes';
import { PetReportProvider } from '@/shared/context/PetReportContext';
import ClientDashboard from '@/pages/ClientDashboard';
import { PaymentProvider } from '@/features/payment/hooks/PaymentProvider';

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
        element: (
          <PaymentProvider>
            <PurchasePage />
          </PaymentProvider>
        ),
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
        path: '/olvide-contrasena',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/recuperar-contrasena',
        element: <ResetPasswordPage />,
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
        children: [...routerMembersOnly],
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
      ...routerLostPet,
      ...routerWorkshop,
      ...routerPlans,
      ...routerManuals,
      ...routerBlogs,
      ...routerAdmin,
    ],
  },
]);

export default router;
