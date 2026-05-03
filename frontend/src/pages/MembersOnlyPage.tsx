import { useParams, useNavigate } from 'react-router';
import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import { Button } from '@/shared/components/ui/Button/Button';
import { HiChevronLeft } from 'react-icons/hi2';
import { Text } from '@shared/components/ui/Text';
import { membersOnlyCards } from '../features/members-only/components/MembersOnlyListSection';

const MembersOnlyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const card = membersOnlyCards.find((c) => c.id === id);

  if (!card) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-[80.67px] lg:pt-0 flex items-center justify-center">
          <Text className="text-gray-700">Contenido no encontrado</Text>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[80.67px] lg:pt-0">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto py-6">
          <Button
            label="Volver"
            variant="purple"
            icon={HiChevronLeft}
            onClick={() => navigate('/members-only')}
          />
        </div>
        <section className="bg-white overflow-hidden py-8 lg:py-16">
          <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-6">
            <Text as="h2" variant="h2" weight="medium">
              {card.title}
            </Text>
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex flex-col gap-4">
              {card.content.split('\n\n').map((paragraph, idx) => (
                <Text key={idx}>{paragraph}</Text>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MembersOnlyPage;
