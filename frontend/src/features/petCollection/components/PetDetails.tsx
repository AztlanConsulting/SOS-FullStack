import PetHero from './PetHero';
import PetContent from './PetContent';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import getFoundPetDetails from '../services/getFoundPetDetails.service';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import { Text } from '@/shared/components/ui/Text';

const PetDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isLoading, error, data } = useQuery({
    queryKey: [params.id],
    queryFn: async () => params.id && (await getFoundPetDetails(params.id)),
    enabled: Boolean(params.id),
  });

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => navigate('/inicio/coleccion-mascotas')}
      />
      <div className="fixed top-18 h-screen right-0 z-50 overflow-scroll overscroll-none slide-in">
        <main className="flex max-md:flex-col bg-white w-screen md:w-120 ">
          {isLoading && <LoadingSpinner size="lg" />}
          {error && (
            <Text color="text-red-600">
              Error cargando la información de búsqueda
            </Text>
          )}
          {data && Object.keys(data).length > 0 && (
            <div className="w-full flex justify-center flex-col gap-4 mb-50 md:mb-20">
              <PetHero petInfo={data} />
              <PetContent petInfo={data} />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default PetDetails;
