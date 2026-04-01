import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { generateColorGradient } from '../../../../utils/colorsUtils';
import type { CountryStatsMetric } from '../../../../domain/model/dashboard/DashboardMetrics';

export const CountriesBarChart: React.FC<CountryStatsMetric> = ({ data }) => {
  const dynamicColors = useMemo(() => {
    return generateColorGradient('#7F0000', '#FFF099', data.length);
  }, [data]);

  return (
    <div style={{ width: '100%' }}>
      {/* Gráfica */}
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            {/* Fondo de líneas punteadas */}
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#EBEBEB"
            />

            {/* Eje Y ocultando la línea principal */}
            <YAxis
              axisLine={false}
              tickLine={false}
              ticks={[0, 100]}
              tick={{ fill: '#999' }}
            />

            <Bar
              dataKey="value"
              background={{ fill: '#F5F5F0' }}
              barSize={40}
              radius={[2, 2, 0, 0]}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={dynamicColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda personalizada*/}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px 24px',
          marginTop: '30px',
          padding: '0 10px',
        }}
      >
        {data.map((country, index) => (
          <div
            key={`legend-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: 'inherit',
            }}
          >
            {/* Contenedor para el color y el nombre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Círculo de color dinámico */}
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: dynamicColors[index],
                }}
              />

              {/* Nombre del país */}
              <span>{country.name}</span>
            </div>

            {/* Valor/Porcentaje alineado a la derecha */}
            <span style={{ fontWeight: 'bold', color: 'inherit' }}>
              {country.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
