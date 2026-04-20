import { ManualPage } from '@pages/ManualPage';
import { ManualsPage } from '@pages/ManualsPage';

const routes = [
  {
    path: '/manuales',
    element: <ManualsPage />,
  },
  {
    path: '/manuales/:id',
    element: <ManualPage />,
  },
];

export default routes;
