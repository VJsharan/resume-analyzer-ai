import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RhetoricalAnalysisProps {
  data: {
    promises?: { count: number; examples: string[] };
    blame_opponents?: { count: number; examples: string[] };
    calls_to_unity?: { count: number; examples: string[] };
    visionary_statements?: { count: number; examples: string[] };
  };
}

export default function RhetoricalAnalysis({ data }: RhetoricalAnalysisProps) {
  const styles = [
    {
      name: 'Promises',
      value: data.promises?.count || 0,
      examples: data.promises?.examples || [],
      color: '#10b981'
    },
    {
      name: 'Blame Opponents',
      value: data.blame_opponents?.count || 0,
      examples: data.blame_opponents?.examples || [],
      color: '#ef4444'
    },
    {
      name: 'Calls to Unity',
      value: data.calls_to_unity?.count || 0,
      examples: data.calls_to_unity?.examples || [],
      color: '#3b82f6'
    },
    {
      name: 'Visionary Statements',
      value: data.visionary_statements?.count || 0,
      examples: data.visionary_statements?.examples || [],
      color: '#8b5cf6'
    }
  ].filter(style => style.value > 0);

  const totalCount = styles.reduce((sum, style) => sum + style.value, 0);

  return (
    <div className="space-y-4">
      {totalCount > 0 ? (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={styles}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {styles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm">Count: {data.value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {styles.map((style, index) => (
              <div key={index} className="border-l-4 p-3 bg-gray-50 rounded-r" style={{ borderColor: style.color }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">{style.name}</h4>
                  <span className="text-sm px-2 py-1 rounded-full text-white" style={{ backgroundColor: style.color }}>
                    {style.value} instances
                  </span>
                </div>
                {style.examples.length > 0 && (
                  <div className="space-y-1">
                    {style.examples.slice(0, 2).map((example, i) => (
                      <p key={i} className="text-sm text-gray-600 italic">
                        "{example.length > 100 ? example.substring(0, 100) + '...' : example}"
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No rhetorical patterns detected</p>
        </div>
      )}
    </div>
  );
}
