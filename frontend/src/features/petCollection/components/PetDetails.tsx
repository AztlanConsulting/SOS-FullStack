import { HeaderBack } from '@/shared/components/layout/HeaderBack';
import PetHero from './PetHero';
import PetContent from './PetContent';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import getFoundPetDetails from '../services/getFoundPetDetails.service';
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner';
import { Text } from '@/shared/components/ui/Text';

const PetDetails = () => {
  const { pathname } = useLocation();

  const { isLoading, error, data } = useQuery({
    queryKey: [pathname],
    queryFn: async () => await getFoundPetDetails(pathname),
  });

  return (
    <div>
      <HeaderBack name={'Mascotas'} />
      <main className="flex max-md:flex-col">
        {isLoading && <LoadingSpinner size="lg" />}
        {error && (
          <Text color="text-red-600">
            Error cargando la información de búsqueda
          </Text>
        )}
        {data && Object.keys(data).length > 0 && (
          <div>
            <PetHero petInfo={data} />
            <PetContent petInfo={data} />
          </div>
        )}
      </main>
    </div>
  );
};

export default PetDetails;
