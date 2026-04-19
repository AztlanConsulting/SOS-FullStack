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
