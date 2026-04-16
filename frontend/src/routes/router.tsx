import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import LandingPage from '../pages/LandingPage';
import CreditsPage from '../pages/CreditsPage';

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
    ],
  },
]);

export default router;
