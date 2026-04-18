import { createBrowserRouter } from 'react-router';
import { App } from '../App';
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
    ],
  },
]);

export default router;
