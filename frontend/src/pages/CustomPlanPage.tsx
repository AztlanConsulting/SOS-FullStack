import { useNavigate } from 'react-router';
import { Text } from '../shared/components/ui/Text';
import CustomPlanCard from '@/features/plans/components/customPlanCard';
import { HeaderBack } from '@/shared/components/layout/HeaderBack';

/**
 * CustomPlanPage Component.
 * * Provides a dedicated page for users to configure their own search plan.
 * It integrates the CustomPlanCard logic within a consistent layout, featuring
 * a navigation-back action and responsive padding.
 */
export default function CustomPlanPage() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderBack name="Regresar a planes" onBack={() => navigate('/planes')} />
      <main className="min-h-screen bg-[#FEF5DA] flex flex-col items-center py-8 px-4">
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
