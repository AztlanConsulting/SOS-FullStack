import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CountdownChartProps {
  totalDays: number;
  daysRemaining: number;
}

export const CountdownChart: React.FC<CountdownChartProps> = ({
  totalDays,
  daysRemaining,
}) => {
  const daysUsed = totalDays - daysRemaining;

  // Recharts necesita un arreglo de objetos.
  // El primer valor es lo que queda (verde), el segundo es lo ya usado (gris).
  const data = [
    { name: 'Restantes', value: daysRemaining },
    { name: 'Usados', value: daysUsed },
  ];
  const COLORS = ['#DDEA25', '#D9D9D9'];

  return (
    <div style={{ width: '100%', height: 160, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Anillo de fondo */}
          <Pie
            data={[{ value: 100 }]}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={100}
            outerRadius={120}
            dataKey="value"
            stroke="none"
            fill="#D9D9D9"
          />

          {/* Anillo de progreso */}
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={100}
            outerRadius={120}
            dataKey="value"
            stroke="none"
            cornerRadius={10}
          >
            <Cell fill="#DDEA25" />
            <Cell fill="transparent" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <span
          style={{ fontSize: '28px', fontWeight: 'bold', color: '#2e7d32' }}
        >
          {daysRemaining}
        </span>
        <br />
        <span style={{ fontSize: '14px', color: '#666' }}>días restantes</span>
      </div>
    </div>
  );
};
