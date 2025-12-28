/**
 * WeightChart - Line chart showing weight trend over time
 * 
 * TypeScript Concepts:
 * - Recharts library integration
 * - Data transformation for chart
 * - Empty state handling
 */

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

interface WeightDataPoint {
  date: string; // "MM/DD" format
  weight: number;
}

interface WeightChartProps {
  /** Weight data points */
  data: WeightDataPoint[];
  /** Time range filter */
  days: '7d' | '14d' | '30d';
  /** Loading state */
  isLoading?: boolean;
}

/**
 * WeightChart - Line chart for weight trend
 */
function WeightChart({ data, days: _days, isLoading = false }: WeightChartProps) {
  // Need at least 2 points to show a line
  if (isLoading) {
    return (
      <div className="weight-chart">
        <div className="weight-chart-skeleton">
          <div className="skeleton skeleton--bar" style={{ height: '200px' }} />
        </div>
      </div>
    );
  }

  if (data.length < 2) {
    return (
      <div className="weight-chart">
        <div className="weight-chart-empty">
          Log weight for 2+ days to see your trend chart
        </div>
      </div>
    );
  }

  // Calculate Y-axis range (min - 2 to max + 2)
  const weights = data.map(d => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const yMin = Math.floor(minWeight - 2);
  const yMax = Math.ceil(maxWeight + 2);
  
  // Calculate 5 evenly-spaced ticks for better readability
  const step = (yMax - yMin) / 4;
  const yTicks = [
    yMin,
    Math.round(yMin + step),
    Math.round(yMin + 2 * step),
    Math.round(yMin + 3 * step),
    yMax,
  ];

  // Format data for Recharts (need numeric x-axis)
  const chartData = data.map((point, index) => ({
    ...point,
    index, // For x-axis positioning
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="weight-chart-tooltip">
          <div className="weight-chart-tooltip-label">{payload[0].payload.date}</div>
          <div className="weight-chart-tooltip-value">{payload[0].value.toFixed(1)} lbs</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="weight-chart">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ left: 40, right: 20, top: 10, bottom: 30 }}>
          <defs>
            <linearGradient id="weightLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-gradient-start)" />
              <stop offset="100%" stopColor="var(--color-gradient-end)" />
            </linearGradient>
          </defs>
          
          <XAxis
            dataKey="index"
            tickFormatter={(index) => {
              // Show 3 labels: first, middle, last
              if (index === 0) return data[0].date;
              if (index === Math.floor(data.length / 2)) return data[Math.floor(data.length / 2)].date;
              if (index === data.length - 1) return data[data.length - 1].date;
              return '';
            }}
            tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }}
            axisLine={false}
            tickLine={false}
          />
          
          <YAxis
            domain={[yMin, yMax]}
            ticks={yTicks}
            tick={{ fontSize: 12, fill: 'var(--color-text-tertiary)' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          
          {/* Horizontal gridlines for better readability */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.12)"
            horizontal={true}
            vertical={false}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Line
            type="monotone"
            dataKey="weight"
            stroke="url(#weightLineGrad)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeightChart;

