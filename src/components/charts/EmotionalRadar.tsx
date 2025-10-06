import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface EmotionalRadarProps {
  data: {
    joy?: number;
    fear?: number;
    anger?: number;
    hope?: number;
    compassion?: number;
    dominant_emotion?: string;
  };
}

export default function EmotionalRadar({ data }: EmotionalRadarProps) {
  const chartData = [
    { emotion: 'Joy', value: (data.joy || 0) * 100, fullMark: 100 },
    { emotion: 'Hope', value: (data.hope || 0) * 100, fullMark: 100 },
    { emotion: 'Compassion', value: (data.compassion || 0) * 100, fullMark: 100 },
    { emotion: 'Fear', value: (data.fear || 0) * 100, fullMark: 100 },
    { emotion: 'Anger', value: (data.anger || 0) * 100, fullMark: 100 }
  ];

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 12, fill: '#4b5563' }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="Emotion Intensity"
            dataKey="value"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 rounded shadow-lg border border-gray-200">
                    <p className="font-semibold">{data.emotion}</p>
                    <p className="text-sm">{Math.round(data.value)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      {data.dominant_emotion && (
        <div className="text-center mt-2">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            Dominant: {data.dominant_emotion.charAt(0).toUpperCase() + data.dominant_emotion.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
}
