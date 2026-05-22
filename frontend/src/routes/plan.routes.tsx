import CustomPlanPage from '@/pages/CustomPlanPage';
import PlansPage from '@pages/Plans';
import RenewPlansPage from '@pages/RenewPlansPage';

export default [
  {
    path: '/planes',
    element: <PlansPage />,
  },
  {
    path: '/planes/personalizado',
    element: <CustomPlanPage />,
  },
  {
    path: '/renovar-planes',
    element: <RenewPlansPage />,
  },
];
