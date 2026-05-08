import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { PlanDistributionMetric } from '@features/graphs/types/dashboardMetrics';

const PLAN_COLORS = [
  '#fce579',
  '#f9cd48',
  '#f0b800',
  '#e6a800',
  '#c98f00',
  '#8c5e00',
];

interface ActivePlanChartProps {
  data: PlanDistributionMetric[];
}

export const ActivePlanChart: React.FC<ActivePlanChartProps> = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    return null;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '250px',
        border: 'none',
        outline: 'none',
      }}
    >
      {/* Gráfica */}
      <div style={{ position: 'relative', width: '50%', height: '100%' }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ border: 'none', outline: 'none' }}
        >
          <PieChart tabIndex={-1}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              dataKey="value"
              stroke="none"
              focusable={false}
            >
              {data.map((entry, index) => {
                const cellColor =
                  entry.color || PLAN_COLORS[index % PLAN_COLORS.length];
                return <Cell key={`cell-${index}`} fill={cellColor} />;
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'inherit',
              lineHeight: '1',
            }}
          >
            {total}
          </div>
          <div style={{ fontSize: '12px', color: '#000000', marginTop: '4px' }}>
            Total
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div
        className="-translate-x-4 md:translate-x-0"
        style={{
          width: '50%',
          paddingLeft: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {data.map((entry, index) => {
          const dotColor =
            entry.color || PLAN_COLORS[index % PLAN_COLORS.length];

          return (
            <div
              key={`legend-${index}`}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: dotColor,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '16px',
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.name} - {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
