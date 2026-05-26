import CustomPlanPage from '@/pages/CustomPlanPage';
import PlansPage from '@pages/Plans';

export default [
  {
    path: '/planes',
    element: <PlansPage />,
  },
  {
    path: '/planes/personalizado',
    element: <CustomPlanPage />,
  },
];
