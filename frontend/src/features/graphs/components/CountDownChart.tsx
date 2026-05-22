import { useEffect, useMemo, useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { PlanSubscriptionProgress } from '@features/graphs/types/dashboardMetrics';
import { Text } from '@/shared/components/ui/Text';
import { calculateStackedExpiry } from '@/shared/utils/planDates';

interface CountdownChartProps {
  data?: PlanSubscriptionProgress;
  size?: 'default' | 'large';
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

export const CountdownChart = ({
  data,
  size = 'default',
}: CountdownChartProps) => {
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
  }, [data]);

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

    const thickness = Math.max(14, Math.min(22, outer * 0.11));

    return {
      outerRadius: outer,
      innerRadius: outer - thickness,
    };
  }, [chartSize]);

  if (!data) {
    return null;
  }

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Total days is the sum of all plan durations
  const plans = data.plans ?? [];
  const totalDays = plans.reduce((acc, plan) => acc + (plan?.duration ?? 0), 0);

  // Calculate stacked expiries from plans (convert createdAt to string)
  const sortedPlans = [...plans].sort(
    (a, b) =>
      new Date(a.createdAt ?? 0).getTime() -
      new Date(b.createdAt ?? 0).getTime(),
  );

  const expiryDates = calculateStackedExpiry(
    sortedPlans.map((p) => ({
      createdAt:
        p?.createdAt?.toString?.() ?? new Date(p?.createdAt).toISOString(),
      duration: p?.duration ?? 0,
    })),
  );

  const finalExpiry = expiryDates.length
    ? new Date(Math.max(...expiryDates.map((d) => d.getTime())))
    : null;
  const now = new Date();
  const msRemaining = finalExpiry ? finalExpiry.getTime() - now.getTime() : 0;
  const daysRemaining =
    msRemaining <= 0 ? 0 : Math.ceil(msRemaining / MS_PER_DAY);

  const daysUsed = Math.max(0, totalDays - daysRemaining);

  const progressPercentage = totalDays > 0 ? (totalDays * 100) / daysUsed : 0;

  const progressColor = getProgressColor(progressPercentage);
  const chartFrameStyle =
    size === 'large'
      ? {
          aspectRatio: '3 / 1',
          maxHeight: '260px',
          minHeight: '170px',
        }
      : { height: 'clamp(145px, 42vw, 220px)' };
  const chartTopPadding = size === 'large' ? '100px' : '10px';
  const summaryPositionStyle =
    size === 'large'
      ? { top: '80%', transform: 'translate(-50%, -50%)' }
      : { bottom: '0px', transform: 'translateX(-50%)' };

  const pieData = [
    { name: 'Transcurrido', value: daysRemaining },
    { name: 'Restante', value: daysUsed },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: chartTopPadding,
      }}
    >
      <Text
        as="div"
        variant="caption"
        weight="medium"
        color="text-[#333]"
        className="absolute top-[0px] lg:top-[10px] left-0 bg-[#FCFCD4] border border-[#D4E157] rounded-[4px] px-3 py-1 z-10"
      >
        Lleva {daysUsed} días tu plan
      </Text>

      <div
        ref={chartContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          ...chartFrameStyle,
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
            left: '50%',
            textAlign: 'center',
            width: '100%',
            ...summaryPositionStyle,
          }}
        >
          <Text variant="h2" weight="medium" as="div" color="text-inherit">
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
      <div className="mt-10 text-center">
        <Text variant="caption" weight="medium" color="text-gray-500">
          Fechas de expiración por plan
        </Text>
        <div className="mt-8 flex flex-col items-center gap-2">
          {expiryDates.length > 0 &&
            sortedPlans.map((p: any, i: number) => (
              <Text key={`${p?.name ?? 'plan'}-${i}`} variant="body" as="div">
                {p?.name ?? 'Sin nombre'} —{' '}
                {expiryDates[i]?.toLocaleDateString('es-ES')}
              </Text>
            ))}
        </div>
      </div>
      <Text
        variant="body"
        weight="medium"
        as="div"
        className="text-center mt-9 mb-4"
      >
        Plan {sortedPlans.map((p: any) => p?.name ?? '').join(' + ')}
      </Text>
    </div>
  );
};
