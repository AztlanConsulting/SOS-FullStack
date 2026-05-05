import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { PlanSubscriptionProgress } from '@features/graphs/types/dashboardMetrics';
import { Text } from '@/shared/components/ui/Text';

interface CountdownChartProps {
  data?: PlanSubscriptionProgress;
}

export const CountdownChart = ({ data }: CountdownChartProps) => {
  if (!data) {
    return null;
  }

  const { planName, totalDays, daysRemaining } = data;
  const daysUsed = totalDays - daysRemaining;

  const pieData = [
    { name: 'Transcurrido', value: daysRemaining },
    { name: 'Restante', value: daysUsed },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '10px' }}>
      <Text
        as="div"
        variant="caption"
        weight="medium"
        color="text-[#333]"
        className="absolute -top-[10px] left-0 bg-[#FCFCD4] border border-[#D4E157] rounded-[4px] px-3 py-1 z-10"
      >
        Quedan {daysRemaining} días
      </Text>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '150px',
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={1}
          minHeight={1}
        >
          <PieChart>
            <Pie
              data={[{ value: 100 }]}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={112}
              outerRadius={125}
              dataKey="value"
              stroke="none"
              fill="#E0E0E0"
              cornerRadius={5}
            />
            <Pie
              data={pieData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={112}
              outerRadius={125}
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              <Cell fill="#DDEA25" />
              <Cell fill="transparent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Text variant="h1" weight="regular" as="div" color="text-inherit">
            {daysUsed} días
          </Text>
          <Text
            variant="caption"
            weight="medium"
            as="div"
            color="text-[#61646B]"
            className="mt-2"
          >
            de {totalDays} días
          </Text>
        </div>
      </div>

      <Text
        variant="body"
        weight="medium"
        as="div"
        className="text-center mt-8"
      >
        Plan {planName}
      </Text>
    </div>
  );
};
