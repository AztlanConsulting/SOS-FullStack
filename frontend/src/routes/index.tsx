import PlansPage from '../pages/Plans';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/planes',
    element: <PlansPage />,
  },
]);
