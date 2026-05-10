import { HeaderBack } from '@/shared/components/layout/HeaderBack';
import PetHero from './PetHero';
import PetContent from './PetContent';

const PetDetails = () => {
  return (
    <div>
      <HeaderBack name={'Mascotas'} />
      <main className="flex max-md:flex-col">
        <PetHero />
        {/* <PetContent petInfo={undefined} /> */}
      </main>
    </div>
  );
};

export default PetDetails;
