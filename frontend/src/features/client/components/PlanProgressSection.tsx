import { CountdownChart } from '@/features/graphs/components/CountDownChart';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import type { PlanSubscriptionProgress } from '@/features/graphs/types/dashboardMetrics';

interface PlanProgressSectionProps {
  petData: PlanSubscriptionProgress | null;
}

const PlanProgressSection = ({ petData }: PlanProgressSectionProps) => {
  return (
    <div className="flex flex-col gap-5">
      <Text variant="h2" weight="bold" className="text-gray-900">
        Progreso del plan
      </Text>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
        {petData ? (
          <>
            <CountdownChart data={petData} />
            <div className="w-full mt-6">
              <Button
                label="Extender plan"
                onClick={() => console.log('Extender plan')}
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
