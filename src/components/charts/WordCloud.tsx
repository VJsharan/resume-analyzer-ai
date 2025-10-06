import { useMemo } from 'react';

interface WordCloudProps {
  words: Array<{ text: string; weight: number }>;
  width?: number;
  height?: number;
  className?: string;
}

export default function WordCloud({
  words,
  width = 400,
  height = 300,
  className = ''
}: WordCloudProps) {
  const processedWords = useMemo(() => {
    if (!words || words.length === 0) return [];

    // Sort words by weight and take top 20
    const sortedWords = [...words]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 20);

    const maxWeight = Math.max(...sortedWords.map(w => w.weight));
    const minWeight = Math.min(...sortedWords.map(w => w.weight));

    // Generate simple positioned words with scaling
    return sortedWords.map((word, index) => {
      const normalizedWeight = (word.weight - minWeight) / (maxWeight - minWeight || 1);
      const fontSize = 12 + normalizedWeight * 24; // 12px to 36px
      const opacity = 0.4 + normalizedWeight * 0.6; // 40% to 100% opacity

      // Simple grid-like positioning with some randomness
      const cols = Math.ceil(Math.sqrt(sortedWords.length));
      const row = Math.floor(index / cols);
      const col = index % cols;

      const x = (col + 0.5) * (width / cols) + (Math.random() - 0.5) * 40;
      const y = (row + 0.5) * (height / Math.ceil(sortedWords.length / cols)) + (Math.random() - 0.5) * 20;

      // Color based on word type/sentiment (simple heuristic)
      const getColor = (text: string) => {
        const politicalWords = ['government', 'policy', 'development', 'sarkar', 'vikas'];
        const emotionalWords = ['people', 'hope', 'future', 'together', 'unity', 'janata'];

        if (politicalWords.some(pw => text.toLowerCase().includes(pw))) {
          return '#2563eb'; // Blue for political
        } else if (emotionalWords.some(ew => text.toLowerCase().includes(ew))) {
          return '#059669'; // Green for emotional
        }
        return '#6b7280'; // Gray for neutral
      };

      return {
        text: word.text,
        x: Math.max(fontSize/2, Math.min(width - fontSize/2, x)),
        y: Math.max(fontSize/2, Math.min(height - fontSize/2, y)),
        fontSize,
        opacity,
        color: getColor(word.text),
        weight: word.weight
      };
    });
  }, [words, width, height]);

  if (!words || words.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">💭</div>
          <div className="text-sm">No keywords available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <svg width={width} height={height} className="w-full h-full">
        {processedWords.map((word, index) => (
          <g key={index}>
            <title>{`${word.text}: ${word.weight} mentions`}</title>
            {/* Word shadow */}
            <text
              x={word.x + 1}
              y={word.y + 1}
              fontSize={word.fontSize}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={word.weight > (words[0]?.weight || 0) * 0.7 ? 'bold' : 'medium'}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(0,0,0,0.1)"
              className="select-none"
            >
              {word.text}
            </text>

            {/* Main word */}
            <text
              x={word.x}
              y={word.y}
              fontSize={word.fontSize}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={word.weight > (words[0]?.weight || 0) * 0.7 ? 'bold' : 'medium'}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={word.color}
              opacity={word.opacity}
              className="select-none cursor-pointer transition-all duration-200 hover:opacity-100"
            >
              {word.text}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-gray-600">Political</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-gray-600">Emotional</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
            <span className="text-gray-600">General</span>
          </div>
        </div>
      </div>
    </div>
  );
}