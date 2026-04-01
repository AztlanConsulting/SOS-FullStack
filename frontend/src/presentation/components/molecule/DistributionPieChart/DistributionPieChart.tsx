import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DistributionData } from '../../../../../domain/model/dashboard/DashboardMetrics';

interface Props {
  data: DistributionData[];
}
const COLORS = ['#715C1E', '#CFAC42', '#F6B349', '#F9CD48'];

export const DistributionPieChart: React.FC<Props> = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={110}
          dataKey="value"
          stroke="none"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        {/* Leyenda a la derecha con íconos circulares */}
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconType="circle"
          wrapperStyle={{ fontSize: '14px', color: '#333' }}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
