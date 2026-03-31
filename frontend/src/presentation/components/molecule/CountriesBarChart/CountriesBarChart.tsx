import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { generateColorGradient } from '../../../../utils/colorsUtils'; // Ajusta la ruta si es necesario

interface CountryData {
  name: string;
  value: number;
}

interface Props {
  data: CountryData[];
}

export const CountriesBarChart: React.FC<Props> = ({ data }) => {
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
              color: '#4A5568',
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
              ></span>

              {/* Nombre del país */}
              <span>{country.name}</span>
            </div>

            {/* Valor/Porcentaje alineado a la derecha */}
            <span style={{ fontWeight: 'bold', color: '#1A202C' }}>
              {country.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
