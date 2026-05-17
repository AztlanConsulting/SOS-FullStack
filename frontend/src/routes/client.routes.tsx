<<<<<<< HEAD
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ClientsPage } from '@/pages/ClientPage';

/**
 * Route configuration for Client-related pages.
 *
 * This array defines the path and the associated component,
 * wrapped in a security layer to restrict access based on user roles.
 */
const routerClients = [
  {
    path: '/clientes',
    element: (
      <RoleProtectedRoute allowedRoles={['ADMIN']}>
        <ClientsPage />
      </RoleProtectedRoute>
    ),
  },
];

export default routerClients;
=======
import ClientDashboardContent from '@/features/client/components/ClientDashboardContent';
import routerPetCollection from './petCollection.routes';

const router = [
  {
    path: '',
    element: <ClientDashboardContent />,
  },
  ...routerPetCollection,
];

export default router;
>>>>>>> f8193bbcb3386dcd51f79fd079f7ed6a5b68e0d7
