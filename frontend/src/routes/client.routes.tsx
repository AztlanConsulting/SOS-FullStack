import ClientDashboardOverview from '@/pages/ClientDashboardOverview';
import routerPetCollection from './petCollection.routes';

const router = [
  {
    path: '',
    element: <ClientDashboardOverview />,
  },
  ...routerPetCollection,
];

export default router;
