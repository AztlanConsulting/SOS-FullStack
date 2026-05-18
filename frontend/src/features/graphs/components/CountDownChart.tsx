import { useEffect, useMemo, useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { PlanSubscriptionProgress } from '@features/graphs/types/dashboardMetrics';
import { Text } from '@/shared/components/ui/Text';

interface CountdownChartProps {
  data?: PlanSubscriptionProgress;
}

const getProgressColor = (progressPercentage: number) => {
  if (progressPercentage < 30) {
    return 'var(--color-status-danger)';
  }

  if (progressPercentage < 70) {
    return 'var(--color-status-warning)';
  }

  return 'var(--color-status-ok)';
};

export const CountdownChart = ({ data }: CountdownChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = chartContainerRef.current;

    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      setChartSize({
        width,
        height,
      });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const { innerRadius, outerRadius } = useMemo(() => {
    if (chartSize.width === 0 || chartSize.height === 0) {
      return {
        innerRadius: 112,
        outerRadius: 125,
      };
    }

    const maxRadiusByWidth = chartSize.width * 0.47;
    const maxRadiusByHeight = chartSize.height * 0.95;

    const outer = Math.min(maxRadiusByWidth, maxRadiusByHeight);

    const thickness = Math.max(14, Math.min(22, outer * 0.12));

    return {
      outerRadius: outer,
      innerRadius: outer - thickness,
    };
  }, [chartSize]);

  if (!data) {
    return null;
  }

  const { planName, totalDays, daysRemaining } = data;

  const daysUsed = totalDays - daysRemaining;

  const progressPercentage = (daysRemaining * 100) / totalDays;

  const progressColor = getProgressColor(progressPercentage);

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
        Lleva {daysUsed} días tu plan
      </Text>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(145px, 42vw, 220px)',
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
              innerRadius={innerRadius}
              outerRadius={outerRadius}
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
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              <Cell fill={progressColor} />
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
            {daysRemaining} días
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
