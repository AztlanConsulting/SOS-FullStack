import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SalesData } from '../../../../../domain/model/dashboard/DashboardMetrics';

interface Props { data: SalesData[]; }

const BAR_COLORS = ['#7B1E1A', '#A32924', '#D1382E', '#E65C38', '#E68A38',];

export const SalesBarChart: React.FC<Props> = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#EBEBEB" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#333', fontSize: 14, fontWeight: 'bold' }} 
          dy={10}
        />
        
        <YAxis axisLine={false} tickLine={false} ticks={[0, 100]} tick={{ fill: '#999' }} />

        <Bar 
          dataKey="value" 
          background={{ fill: '#F5F5F0' }} 
          barSize={40} 
          radius={[2, 2, 0, 0]}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);