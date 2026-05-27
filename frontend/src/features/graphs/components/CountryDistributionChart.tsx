import { useRef, useEffect } from 'react';
import { Text } from '@/shared/components/ui/Text';
import type { CountryMetric } from '../hooks/useClientsByCountry';

interface Props {
  data: CountryMetric[];
}

/**
 * Extended canvas element to store a local reference to the active Chart.js context.
 * This prevents component re-render collision cycles and memory leakage.
 */
interface CanvasWithChart extends HTMLCanvasElement {
  _chartInstance?: { destroy(): void };
}

declare global {
  interface Window {
    Chart: unknown;
  }
}

/**
 * CountryDistributionChart Component
 * * Renders an optimized horizontal bar chart using custom HTML5 Canvas processing layers.
 * Designed dynamically to self-scale layouts cleanly according to responsive telemetry matrices.
 *
 * @param props - Explicit properties interface carrying analytical data arrays.
 */
export const CountryDistributionChart = ({ data }: Props) => {
  const canvasRef = useRef<CanvasWithChart>(null);

  useEffect(() => {
    console.log(data);
    if (!canvasRef.current || !data.length) return;

    const Chart = window.Chart;
    if (!Chart) return;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const existing = canvasRef.current._chartInstance;
    if (existing) existing.destroy();

    const chart = new (Chart as unknown as {
      new (ctx: HTMLCanvasElement, config: unknown): { destroy(): void };
    })(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            label: 'Clientes',
            data: data.map((d) => d.value),
            backgroundColor: '#EF9F27',
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: unknown) => {
                const { raw } = ctx as { raw: number };
                return ` ${raw} clientes (${Math.round((raw / total) * 100)}%)`;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#888' } },
          y: {
            grid: { display: false },
            ticks: { color: '#555', font: { size: 12 } },
          },
        },
      },
    });

    canvasRef.current._chartInstance = chart;
  }, [data]);

  if (!data.length)
    return (
      <Text variant="caption" color="text-gray-400">
        Sin datos de países.
      </Text>
    );

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${data.length * 40 + 80}px`,
      }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Distribución de clientes por país"
      />
    </div>
  );
};
