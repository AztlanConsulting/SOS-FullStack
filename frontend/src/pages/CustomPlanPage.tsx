import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import Header from '../shared/components/layout/Header';
import { Text } from '../shared/components/ui/Text';
import CustomPlanCard from '@/features/plans/components/customPlanCard';

export default function CustomPlanPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FEF5DA] flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-sm mb-6 self-start">
          <button
            onClick={() => navigate('/planes')}
            className="flex items-center gap-2 text-black hover:text-[#F9CD48] transition-colors"
          >
            <HiArrowLeft size={24} />
            <Text
              variant="body"
              weight="medium"
              className="hidden md:inline self-start"
            >
              Regresar a planes
            </Text>
          </button>
        </div>
        <Text
          variant="h2"
          weight="medium"
          as="h2"
          className="text-gray-900 mb-6"
        >
          Personaliza tu plan
        </Text>
        <CustomPlanCard />
      </main>
    </>
  );
}
