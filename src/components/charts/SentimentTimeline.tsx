import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface VoiceCharacteristics {
  pitch_hz: number;
  energy_level: number;
  vocal_emotion: string;
}

interface SentimentTimelineProps {
  data: Array<{
    timestamp: string;
    sentiment: number;
    emotion: string;
    topic: string;
    voice_characteristics?: VoiceCharacteristics;
  }>;
}

export default function SentimentTimeline({ data }: SentimentTimelineProps) {
  // Check if voice data is available
  const hasVoiceData = data.some(item => item.voice_characteristics);

  // Transform data for chart
  const chartData = data.map((item) => ({
    name: item.timestamp,
    sentiment: Math.round(item.sentiment * 100),
    emotion: item.emotion,
    topic: item.topic,
    // Add voice characteristics if available
    pitch: item.voice_characteristics?.pitch_hz || null,
    energy: item.voice_characteristics ? Math.round(item.voice_characteristics.energy_level * 100) : null,
    vocal_emotion: item.voice_characteristics?.vocal_emotion || null
  }));

  // Calculate dynamic pitch range for better visualization
  let pitchDomain: [number, number] = [50, 300];
  if (hasVoiceData) {
    const pitchValues = chartData.map(d => d.pitch).filter(p => p !== null) as number[];
    if (pitchValues.length > 0) {
      const minPitch = Math.min(...pitchValues);
      const maxPitch = Math.max(...pitchValues);
      const padding = (maxPitch - minPitch) * 0.2 || 20; // 20% padding or minimum 20 Hz
      pitchDomain = [
        Math.max(50, Math.floor(minPitch - padding)),
        Math.min(500, Math.ceil(maxPitch + padding))
      ];
    }
  }

  const getSentimentColor = (value: number) => {
    if (value >= 60) return '#10b981'; // green
    if (value >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = getSentimentColor(payload.sentiment);

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="w-full h-full">
      {hasVoiceData && (
        <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-900 font-semibold flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span>
            Enhanced with OpenSMILE Voice Analysis
          </p>
          <p className="text-xs text-indigo-700 mt-1">
            Pitch and energy patterns shown alongside text sentiment
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={hasVoiceData ? "80%" : "100%"}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="sentiment"
            domain={[-100, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Sentiment', angle: -90, position: 'insideLeft' }}
          />
          {hasVoiceData && (
            <YAxis
              yAxisId="pitch"
              orientation="right"
              domain={pitchDomain}
              tick={{ fontSize: 12 }}
              label={{ value: 'Pitch (Hz)', angle: 90, position: 'insideRight' }}
            />
          )}
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
                    <p className="font-bold text-lg mb-2">{data.name}</p>

                    <div className="space-y-1 border-t pt-2">
                      <p className="text-sm font-semibold text-gray-700">Text Analysis:</p>
                      <p className="text-sm">• Sentiment: {data.sentiment}</p>
                      <p className="text-sm">• Emotion: {data.emotion}</p>
                      <p className="text-sm text-gray-600">• Topic: {data.topic}</p>
                    </div>

                    {data.pitch && (
                      <div className="space-y-1 border-t pt-2 mt-2">
                        <p className="text-sm font-semibold text-indigo-700">Voice Analysis:</p>
                        <p className="text-sm">• Pitch: {data.pitch} Hz</p>
                        <p className="text-sm">• Energy: {data.energy}%</p>
                        <p className="text-sm">• Vocal Emotion: {data.vocal_emotion}</p>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />

          {/* Sentiment line (GPT analysis) */}
          <Line
            yAxisId="sentiment"
            type="monotone"
            dataKey="sentiment"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={<CustomDot />}
            name="Text Sentiment (GPT)"
          />

          {/* Pitch line (OpenSMILE analysis) - shown only if voice data available */}
          {hasVoiceData && (
            <Line
              yAxisId="pitch"
              type="monotone"
              dataKey="pitch"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#8b5cf6' }}
              name="Voice Pitch (OpenSMILE)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
