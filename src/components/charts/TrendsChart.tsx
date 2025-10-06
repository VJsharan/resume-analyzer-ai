import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendsChartProps {
  data: Array<{
    date: string;
    value: number;
    count: number;
  }>;
  dataKey?: string;
  title?: string;
  color?: string;
  type?: 'line' | 'area';
}

export default function TrendsChart({
  data,
  dataKey = 'value',
  title = 'Trend Analysis',
  color = '#3b82f6',
  type = 'area'
}: TrendsChartProps) {
  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-slate-900 mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 12 }}
            stroke="#cbd5e1"
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            stroke="#cbd5e1"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            formatter={(value: any) => [value, dataKey === 'value' ? 'Score' : dataKey]}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => <span className="text-sm text-slate-700">{value}</span>}
          />
          <DataComponent
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={type === 'area' ? color : undefined}
            fillOpacity={type === 'area' ? 0.3 : undefined}
            strokeWidth={2}
            name={title}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
