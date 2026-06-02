import { RoleProtectedRoute } from './RoleProtectedRoute';
import { RecursosPage } from '@/pages/ResourcesPage';

/**
 * Route configuration for Client-related pages.
 *
 * This array defines the path and the associated component,
 * wrapped in a security layer to restrict access based on user roles.
 */
const routerResources = [
    {
        path: '/recursos',
        element: (
            <RoleProtectedRoute allowedRoles={['ADMIN']}>
                <RecursosPage />
            </RoleProtectedRoute>
        ),
    },
];

export default routerResources;
