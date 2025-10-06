import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TrendDataPoint {
  date: string;
  count: number;
  political: number;
  nonPolitical: number;
  avgEmpathy: number;
  avgProcessingTime: number;
}

interface LanguageDistribution {
  name: string;
  value: number;
  color: string;
}

interface SentimentTrend {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-lg">
        <p className="text-sm font-medium text-neutral-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center text-sm">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-neutral-600">{entry.dataKey}:</span>
            <span className="font-medium text-neutral-900 ml-1">
              {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Analysis Volume Trend Chart
export const AnalysisVolumeChart: React.FC<{ data: TrendDataPoint[] }> = ({ data }) => {
  return (
    <div className="card-enterprise">
      <div className="card-header">
        <h3 className="card-title">Analysis Volume Trends</h3>
        <p className="text-sm text-neutral-600 mt-1">Daily analysis activity over time</p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#volumeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Political vs Non-Political Distribution Chart
export const ClassificationDistributionChart: React.FC<{ data: TrendDataPoint[] }> = ({ data }) => {
  return (
    <div className="card-enterprise">
      <div className="card-header">
        <h3 className="card-title">Content Classification Trends</h3>
        <p className="text-sm text-neutral-600 mt-1">Political vs Non-political content over time</p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="political"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                name="Political Content"
              />
              <Line
                type="monotone"
                dataKey="nonPolitical"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                name="Non-Political Content"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Language Distribution Pie Chart
export const LanguageDistributionChart: React.FC<{ data: LanguageDistribution[] }> = ({ data }) => {
  return (
    <div className="card-enterprise">
      <div className="card-header">
        <h3 className="card-title">Language Distribution</h3>
        <p className="text-sm text-neutral-600 mt-1">Content analyzed by language</p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data as any}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex justify-center">
          <div className="grid grid-cols-2 gap-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-neutral-700 font-medium">
                  {item.name}
                </span>
                <span className="text-sm text-neutral-500 ml-1">
                  ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Empathy Score Trend Chart
export const EmpathyTrendChart: React.FC<{ data: TrendDataPoint[] }> = ({ data }) => {
  return (
    <div className="card-enterprise">
      <div className="card-header">
        <h3 className="card-title">Average Empathy Trends</h3>
        <p className="text-sm text-neutral-600 mt-1">Empathy scores over time</p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="empathyGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="avgEmpathy"
                stroke="url(#empathyGradient)"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                name="Average Empathy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Performance Metrics Chart
export const PerformanceChart: React.FC<{ data: TrendDataPoint[] }> = ({ data }) => {
  return (
    <div className="card-enterprise">
      <div className="card-header">
        <h3 className="card-title">Processing Performance</h3>
        <p className="text-sm text-neutral-600 mt-1">Average processing time trends</p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={<CustomTooltip />}
                formatter={(value: number) => [`${value.toFixed(1)}s`, 'Processing Time']}
              />
              <Bar
                dataKey="avgProcessingTime"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="Avg Processing Time"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Sentiment Distribution Over Time
export const SentimentTrendChart: React.FC<{ data: SentimentTrend[] }> = ({ data }) => {
  return (
    <div className="card-enterprise">
      <div className="card-header">
        <h3 className="card-title">Sentiment Trends</h3>
        <p className="text-sm text-neutral-600 mt-1">Sentiment distribution over time</p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="positive"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
                name="Positive"
              />
              <Area
                type="monotone"
                dataKey="neutral"
                stackId="1"
                stroke="#6b7280"
                fill="#6b7280"
                fillOpacity={0.8}
                name="Neutral"
              />
              <Area
                type="monotone"
                dataKey="negative"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.8}
                name="Negative"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Combined Trends Grid Component
interface TrendChartsGridProps {
  analysisVolumeData: TrendDataPoint[];
  languageData: LanguageDistribution[];
  sentimentData: SentimentTrend[];
  className?: string;
}

export const TrendChartsGrid: React.FC<TrendChartsGridProps> = ({
  analysisVolumeData,
  languageData,
  sentimentData,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Chart */}
      <AnalysisVolumeChart data={analysisVolumeData} />

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClassificationDistributionChart data={analysisVolumeData} />
        <LanguageDistributionChart data={languageData} />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmpathyTrendChart data={analysisVolumeData} />
        <SentimentTrendChart data={sentimentData} />
      </div>
    </div>
  );
};

export default TrendChartsGrid;