import { CountdownChart } from '@/features/graphs/components/CountDownChart';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import type { PlanSubscriptionProgress } from '@/features/graphs/types/dashboardMetrics';
import { useNavigate } from 'react-router';

interface PlanProgressSectionProps {
  petData: PlanSubscriptionProgress | null;
}

const PlanProgressSection = ({ petData }: PlanProgressSectionProps) => {
  const navigate = useNavigate();

  const handlePlanExtension = () => {
    navigate('/extender-plan');
  };

  return (
    <div className="flex flex-col gap-5">
      <Text
        variant="h3"
        weight="medium"
        className="text-center lg:text-left w-full"
      >
        Progreso del plan
      </Text>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
        {petData ? (
          <>
            <CountdownChart data={petData} />
            <div className="w-[250px] mt-4 mx-auto">
              <Button
                label="Extender plan"
                onClick={handlePlanExtension}
                variant="primary"
                textColor="bg-purple-primary text-white hover:bg-[#866CA0]"
              />
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <Text variant="body" color="text-gray-500">
              No tienes un plan activo en este momento.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanProgressSection;
