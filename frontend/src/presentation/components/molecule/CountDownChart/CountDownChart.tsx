import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PlanSubscriptionProgress } from '../../../../../domain/models/DashboardMetrics';

export const CountdownChart: React.FC<PlanSubscriptionProgress> = ({
  planName,
  totalDays,
  daysRemaining,
}) => {
  const daysUsed = totalDays - daysRemaining;

  // Recharts necesita un arreglo de objetos.
  // El primer valor es lo que queda (verde), el segundo es lo ya usado (gris).
  const data = [
    { name: 'Transcurrido', value: daysRemaining },
    { name: 'Restante', value: daysUsed },
  ];
  const COLORS = ['#DDEA25', '#D9D9D9'];

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '10px' }}>
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '0',
          backgroundColor: '#FCFCD4',
          border: '1px solid #D4E157',
          borderRadius: '4px',
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
          zIndex: 10,
        }}
      >
        Quedan {daysRemaining} días
      </div>

      {/* Contenedor de la gráfica */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '220px',
          marginTop: '30px',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Anillo de fondo (Gris sólido) */}
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
              fill="#E0E0E0"
              cornerRadius={5}
            />
            {/* Anillo de progreso (Verde/Amarillo) */}
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
              cornerRadius={5}
            >
              <Cell fill="#D4E157" />
              <Cell fill="transparent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Texto centrado dentro de la media dona */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: '#222',
              lineHeight: '1',
              fontWeight: '500',
            }}
          >
            {daysUsed} días
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#666',
              marginTop: '8px',
              fontWeight: 'bold',
            }}
          >
            de {totalDays} días
          </div>
        </div>
      </div>

      {/* Título del plan */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#222',
        }}
      >
        {planName}
      </div>
    </div>
  );
};
