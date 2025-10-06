import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonBarChartProps {
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  dataKeys: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  title?: string;
  yAxisLabel?: string;
}

export default function ComparisonBarChart({
  data,
  dataKeys,
  title,
  yAxisLabel
}: ComparisonBarChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 12 }}
            stroke="#cbd5e1"
          />
          <YAxis
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fill: '#64748b' } } : undefined}
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
            cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) => <span className="text-sm text-slate-700">{value}</span>}
          />
          {dataKeys.map((dk) => (
            <Bar
              key={dk.key}
              dataKey={dk.key}
              fill={dk.color}
              name={dk.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
