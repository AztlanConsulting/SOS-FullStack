import PetDetails from '@/features/petCollection/components/PetDetails';
import { PetGalleryProvider } from '@/features/petCollection/context/PetCollectionProvider';
import PetCollectionPage from '@/pages/PetCollectionPage';

const router = [
  {
    path: 'radar-de-coincidencias',
    element: (
      <PetGalleryProvider>
        <PetCollectionPage />
      </PetGalleryProvider>
    ),
    children: [
      {
        path: ':id',
        element: <PetDetails />,
      },
    ],
  },
];

export default router;
