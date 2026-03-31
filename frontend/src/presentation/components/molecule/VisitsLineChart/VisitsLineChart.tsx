import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VisitsData } from '../../../../../domain/model/dashboard/DashboardMetrics';

interface Props { data: VisitsData[]; }

export const VisitsLineChart: React.FC<Props> = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
        {/* Líneas horizontales grises de fondo */}
        <CartesianGrid vertical={false} stroke="#EBEBEB" /> 
        
        {/* Quitamos la línea del eje Y y dejamos solo los números */}
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
        
        <Line 
          type="monotone"
          dataKey="val"
          stroke="#9D7FAD"
          strokeWidth={3} 
          dot={{ r: 5, fill: '#9D7FAD', strokeWidth: 0 }}
          activeDot={{ r: 8 }}
          label={{ position: 'top', fill: '#333', fontSize: 14, fontWeight: 'bold' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);