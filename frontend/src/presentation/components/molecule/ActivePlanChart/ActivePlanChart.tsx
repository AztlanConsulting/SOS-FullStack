import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PlanData {
  name: string;
  value: number;
  // Ya no exigimos que el color venga en los datos
  color?: string;
}

interface Props {
  data: PlanData[];
}

const PLAN_COLORS = [
  '#6B5B2E',
  '#C2A34F',
  '#E8B159',
  '#F4D466',
  '#A3B14B',
  '#D4E157',
];

export const ActivePlanChart: React.FC<Props> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '250px',
      }}
    >
      {/* Gráfica */}
      <div style={{ position: 'relative', width: '50%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              dataKey="value"
              stroke="none"
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
              color: '#1A202C',
              lineHeight: '1',
            }}
          >
            {total}
          </div>
          <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
            Total
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div
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
                }}
              ></span>
              <span style={{ fontSize: '16px', color: '#2D3748' }}>
                {entry.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
