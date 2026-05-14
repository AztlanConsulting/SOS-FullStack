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
