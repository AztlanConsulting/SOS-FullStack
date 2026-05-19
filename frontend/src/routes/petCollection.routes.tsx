import PetDetails from '@/features/petCollection/components/PetDetails';
import { PetGalleryProvider } from '@/features/petCollection/context/PetCollectionProvider';
import PetCollectionPage from '@/pages/PetCollectionPage';

const router = [
  {
    path: 'coleccion-mascotas',
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
