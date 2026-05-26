import SearchFormPage from '@/pages/SearchFormPage';
import MembersOnly from '../pages/MembersOnly';
import MembersOnlyPage from '../pages/MembersOnlyPage';
import ClientDashboardOverview from '@/pages/ClientDashboardOverview';
import routerPetCollection from './petCollection.routes';
import { Outlet } from 'react-router';
import ExtenderPlanPage from '@/pages/ExtenderPlanPage';
import { ExclusivePurchasePage } from '@/pages/ExclusivePurchasePage';
import ExclusiveCustomPlanPage from '@/pages/ExclusiveCustomPlanPage';

const routes = [
  {
    path: '',
    element: <ClientDashboardOverview />,
  },
  {
    path: 'contenido-exclusivo',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <MembersOnly />,
      },
      {
        path: 'formulario',
        element: <SearchFormPage />,
      },
      {
        path: 'pagina/:id',
        element: <MembersOnlyPage />,
      },
    ],
  },
  {
    path: 'extender-plan',
    element: <ExtenderPlanPage />,
  },
  {
    path: 'compra',
    element: <ExclusivePurchasePage />,
  },
  {
    path: 'personalizado',
    element: <ExclusiveCustomPlanPage />,
  },
  ...routerPetCollection,
];

export default routes;
