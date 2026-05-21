import { CountdownChart } from '@/features/graphs/components/CountDownChart';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import type { PlanSubscriptionProgress } from '@/features/graphs/types/dashboardMetrics';
import { useNavigate } from 'react-router';

const chartContentClass = 'w-full max-w-xs md:max-w-md lg:max-w-lg';
const actionsClass =
  'flex w-full max-w-xs flex-col gap-3 md:max-w-md md:flex-row md:gap-4 md:text-nowrap';

interface PlanProgressSectionProps {
  petData: PlanSubscriptionProgress | null;
}

const PlanProgressSection = ({ petData }: PlanProgressSectionProps) => {
  const navigate = useNavigate();

  const handlePlanExtension = () => {
    navigate('/extender-plan');
  };

  const handleContactAdviser = () => {
    window.open(
      'https://m.me/2444791512265246',
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <Text variant="h3" weight="medium" className="text-center w-full">
        Progreso del plan
      </Text>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-1 flex-col items-center justify-between">
        {petData ? (
          <>
            <div className={chartContentClass}>
              <CountdownChart data={petData} size="large" />
            </div>
            <div className={actionsClass}>
              <Button
                label="Extender plan"
                onClick={handlePlanExtension}
                variant="primary"
                textColor="bg-purple-primary text-white hover:bg-dark-purple"
              />
              <Button
                label="Contacta con tu asesor"
                onClick={handleContactAdviser}
                variant="primary"
                textColor="bg-purple-secondary text-black hover:bg-dark-purple hover:text-white"
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
