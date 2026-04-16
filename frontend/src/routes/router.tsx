import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import { ManualsPage } from '../pages/ManualsPage';
import { ManualPage } from '../pages/ManualPage';
import { TempPurchasePage } from '../pages/TempPurchasePage';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
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
    ],
  },
]);

export default router;
