import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopicBreakdownProps {
  data: {
    development?: number;
    health?: number;
    education?: number;
    employment?: number;
    corruption?: number;
    religion?: number;
    security?: number;
    economy?: number;
  };
}

export default function TopicBreakdown({ data }: TopicBreakdownProps) {
  const topics = [
    { name: 'Development', value: (data.development || 0) * 100, color: '#10b981' },
    { name: 'Health', value: (data.health || 0) * 100, color: '#ef4444' },
    { name: 'Education', value: (data.education || 0) * 100, color: '#3b82f6' },
    { name: 'Employment', value: (data.employment || 0) * 100, color: '#f59e0b' },
    { name: 'Economy', value: (data.economy || 0) * 100, color: '#8b5cf6' },
    { name: 'Security', value: (data.security || 0) * 100, color: '#ec4899' },
    { name: 'Corruption', value: (data.corruption || 0) * 100, color: '#f97316' },
    { name: 'Religion', value: (data.religion || 0) * 100, color: '#06b6d4' }
  ].filter(topic => topic.value > 0).sort((a, b) => b.value - a.value);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topics} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 rounded shadow-lg border border-gray-200">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm">{Math.round(data.value)}% emphasis</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {topics.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
