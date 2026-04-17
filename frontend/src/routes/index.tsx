import PlansPage from '@pages/Plans';
import { createBrowserRouter } from 'react-router-dom';

/**
 * Main application router configuration.
 * Defines the mapping between URL paths and their respective React components.
 */

export const router = createBrowserRouter([
  {
    /**
     * Route for the plans overview page.
     * Accessible via the '/planes' path to display the plans.
     */
    path: '/planes',
    element: <PlansPage />,
  },
]);
