import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import { ManualsPage } from '../pages/ManualsPage';
import { ManualPage } from '../pages/ManualPage';
import { TempPurchasePage } from '../pages/TempPurchasePage';
import routerWorkshop from './workshop.routes';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <h1>SOS</h1>,
      },
      {
        path: '/manuales',
        element: <ManualsPage />,
      },
      {
        path: '/manuales/:id',
        element: <ManualPage />,
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
