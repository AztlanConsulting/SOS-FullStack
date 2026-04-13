import { createBrowserRouter } from 'react-router';
import { App } from '../App';
import LandingPage from '../pages/LandingPage';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
    ],
  },
]);

export default router;
