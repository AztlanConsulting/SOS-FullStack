import {
  ComposedChart,
  Bar,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

/**
 * Interface representing a weekly data point for the chart.
 */
interface WeeklyVisit {
  week: string;
  views: number;
  engagement: number;
}

interface Props {
  data: WeeklyVisit[];
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/**
 * VisitsLineChart Component
 *
 * A dual-axis composed chart that visualizes traffic (Views) and performance (Engagement).
 * - Primary Y-axis (Left): Measures absolute views using yellow bars.
 * - Secondary Y-axis (Right): Measures engagement percentage (0-100%) using a purple line.
 *
 * Features:
 * - Interactive month navigation.
 * - Responsive container for fluid layouts.
 * - Custom Tooltip with translated labels and unit formatting.
 */
export const VisitsLineChart = ({
  data,
  year,
  month,
  onPrev,
  onNext,
}: Props) => {
  if (!data || !Array.isArray(data)) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrev}
          className="text-gray-400 hover:text-yellow-500 transition-colors px-2"
        >
          ←
        </button>
        <span className="text-caption font-bold text-gray-600">
          {MONTHS[month - 1]} {year}
        </span>
        <button
          onClick={onNext}
          className="text-gray-400 hover:text-yellow-500 transition-colors px-2"
        >
          →
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#EBEBEB" />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  views: 'Vistas',
                  engagement: 'Interacción',
                };
                const formattedValue =
                  name === 'engagement' ? `${value}%` : value;
                return [formattedValue, labels[name as string] ?? name];
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="views"
              fill="#f9cd48"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="engagement"
              stroke="#9D7FAD"
              strokeWidth={2}
              dot={{ r: 5, fill: '#9D7FAD', strokeWidth: 0 }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
