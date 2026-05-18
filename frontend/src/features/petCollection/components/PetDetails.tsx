import { HeaderBack } from '@/shared/components/layout/HeaderBack';
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
    <div className="pt-[80.67px] md:pt-0">
      <HeaderBack name={'Mascotas'} onBack={() => navigate(-1)} />
      <main className="flex max-md:flex-col">
        {isLoading && <LoadingSpinner size="lg" />}
        {error && (
          <Text color="text-red-600">
            Error cargando la información de búsqueda
          </Text>
        )}
        {data && Object.keys(data).length > 0 && (
          <div className="w-full flex justify-center flex-col">
            <PetHero petInfo={data} />
            <PetContent petInfo={data} />
          </div>
        )}
      </main>
    </div>
  );
};

export default PetDetails;
