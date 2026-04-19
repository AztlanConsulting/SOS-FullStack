import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import { ManualsPage } from '../pages/ManualsPage';
import { ManualPage } from '../pages/ManualPage';
import { TempPurchasePage } from '../pages/TempPurchasePage';
import routerWorkshop from './workshop.routes';
import LandingPage from '../pages/LandingPage';
import CreditsPage from '../pages/CreditsPage';
import Therms from '../pages/Therms';

export const router = createBrowserRouter([
  {
    element: <App />,
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
        path: '/manuales',
        element: <ManualsPage />,
        children: [
          {
            path: ':id',
            element: <ManualPage />,
          },
        ],
      },
      {
        path: '/purchase',
        element: <TempPurchasePage />,
      },
      ...routerWorkshop,
    ],
  },
]);

export default router;
