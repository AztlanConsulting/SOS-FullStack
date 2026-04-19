import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import LandingPage from '../pages/LandingPage';
import CreditsPage from '../pages/CreditsPage';
import Therms from '../pages/Therms';
import { ReportConfirmationPage } from '../pages/ReportConfirmation';
import { PetReportProvider } from '../features/users/context/PetReportContext';
import Plans from '../pages/Plans';
import { PaymentPage } from '../features/payment/components/PaymentPage';
import CheckoutPage from '../features/payment/components/CheckoutPage';

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
        path: '/credits',
        element: <CreditsPage />,
      },
      {
        path: '/therms',
        element: <Therms />,
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
    ],
  },
]);

export default router;
