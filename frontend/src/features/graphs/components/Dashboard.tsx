import { useDashboardMetrics } from '@features/graphs/hooks/useDashboardMetrics';

// Prueba de componentes
import { CountdownChart } from './CountDownChart';
import { ActivePlanChart } from './ActivePlanChart';
import { CountriesBarChart } from './CountriesBarChart';
import { VisitsLineChart } from './VisitsLineChart';

export const Dashboard: React.FC = () => {
  const { metrics, loading, error } = useDashboardMetrics();

  if (loading)
    return (
      <p style={{ textAlign: 'center', marginTop: '50px' }}>
        Cargando gráficas...
      </p>
    );

  if (error) return <p>{error}</p>;

  if (!metrics)
    return (
      <p style={{ textAlign: 'center', marginTop: '50px' }}>
        Cargando gráficas...
      </p>
    );

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#F9CD48' }}>
        Gráficas generales de la aplicación
      </h1>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <CountdownChart data={metrics.plan} />
        </div>

        <div style={cardStyle}>
          <h3 style={{ textAlign: 'left' }}>Planes activos</h3>
          <ActivePlanChart data={metrics.distribution} />
        </div>

        <div style={cardStyle}>
          <h3 style={{ textAlign: 'left' }}>Distribución por país</h3>
          <CountriesBarChart data={metrics.sales} />
        </div>

        <div style={cardStyle}>
          <h3 style={{ textAlign: 'left' }}> Visitantes </h3>
          <VisitsLineChart data={metrics.visits} />
        </div>
      </div>
    </div>
  );
};
