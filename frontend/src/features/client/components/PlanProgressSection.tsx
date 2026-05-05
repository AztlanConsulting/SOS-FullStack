import { CountdownChart } from '@/features/graphs/components/CountDownChart';
import { Text } from '@/shared/components/ui/Text/Text';
import type { PlanSubscriptionProgress } from '@/features/graphs/types/dashboardMetrics';

interface PlanProgressSectionProps {
  petData: PlanSubscriptionProgress | null;
}

const PlanProgressSection = ({ petData }: PlanProgressSectionProps) => {
  return (
    <div className="flex flex-col gap-5">
      <Text variant="h3" weight="medium" className="text-center">
        Progreso del plan
      </Text>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
        {petData ? (
          <>
            <CountdownChart data={petData} />
            <div className="w-[250px] mt-4 mx-auto">
              <button
                type="button"
                onClick={() => console.log('Extender plan')}
                className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-full font-semibold text-base transition-colors duration-200 bg-purple-primary text-white hover:bg-purple-primary"
              >
                <div className="flex justify-center items-center w-full cursor-pointer">
                  <Text
                    variant="caption"
                    weight="medium"
                    className="text-white"
                  >
                    Extender plan
                  </Text>
                </div>
              </button>
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
      {/* Check with the team if the divisor line will be implemented */}
      {/* <hr className="border-t border-gray-200 my-8 w-full" /> */}
    </div>
  );
};

export default PlanProgressSection;
