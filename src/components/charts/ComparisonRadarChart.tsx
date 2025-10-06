import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface ComparisonRadarChartProps {
  data: Array<{
    metric: string;
    [key: string]: any;
  }>;
  dataKeys: Array<{
    key: string;
    name: string;
    color: string;
  }>;
  title?: string;
}

export default function ComparisonRadarChart({
  data,
  dataKeys,
  title
}: ComparisonRadarChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
          {dataKeys.map((dk) => (
            <Radar
              key={dk.key}
              name={dk.name}
              dataKey={dk.key}
              stroke={dk.color}
              fill={dk.color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-sm text-slate-700">{value}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
