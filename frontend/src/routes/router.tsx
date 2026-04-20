import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import { TempPurchasePage } from '../pages/TempPurchasePage';
import LandingPage from '../pages/LandingPage';
import CreditsPage from '../pages/CreditsPage';
import Therms from '../pages/Therms';
import { ReportConfirmationPage } from '../pages/ReportConfirmation';
import { PetReportProvider } from '../features/found-pet/context/PetReportService';
import Plans from '../pages/Plans';
import { PaymentPage } from '../features/payment/components/PaymentPage';
import CheckoutPage from '../features/payment/components/CheckoutPage';
import routerWorkshop from './workshop.routes';
import routerPlans from './plan.routes';
import routerManuals from './manual.routes';
import routerLostPet from './foundPet.routes';
import { PetReportForm } from '@features/users/components/PetReportForm';

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
      {
        path: '/paypal-checkout',
        element: <CheckoutPage />,
      },
      ...routerLostPet,
      ...routerWorkshop,
      ...routerPlans,
      ...routerManuals,
    ],
  },
]);

export default router;
