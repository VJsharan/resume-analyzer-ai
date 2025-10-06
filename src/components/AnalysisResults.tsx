import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  Heart,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Languages,
  Target,
  BarChart3,
  Quote,
  Download,
  Mic,
  Volume2,
  Waves,
  Headphones,
  Activity,
  Check,
  AlertCircle
} from 'lucide-react';
import WordCloud from './charts/WordCloud';

interface TimelineSegment {
  start_time: number;
  end_time: number;
  empathy_score: number;
  dominant_emotion: string;
  attention_score: number;
  key_phrases: string[];
  sentiment: string;
  summary: string;
}

interface TimelineAnalysis {
  segments: TimelineSegment[];
  emotional_flow: string;
  empathy_progression: string;
  attention_highlights: string[];
}

interface AnalysisResultsProps {
  data: {
    filename?: string;
    duration_seconds?: number;
    language_detected: string;
    transcript: string;
    empathy_score: number;
    empathy_quotes: Array<{
      timestamp: string;
      text: string;
      score: number;
      acoustic_support?: string;
    }>;
    dominant_emotions: string[];
    emotion_distribution: Record<string, number>;
    key_themes: string[];
    overall_sentiment: string;
    sentiment_score: number;
    positive_quotes: Array<{
      timestamp: string;
      text: string;
      score: number;
      voice_support?: string;
    }>;
    negative_quotes: Array<{
      timestamp: string;
      text: string;
      score: number;
      voice_support?: string;
    }>;
    timeline_analysis?: TimelineAnalysis;
    analysis_confidence: number;
    processing_time_seconds?: number;
    no_speech_detected?: boolean;
    message?: string;
    is_political?: boolean;
    classification_confidence?: number;
    classification_reasoning?: string;
    rhetoric_strategies?: string[];
    policy_vs_emotion_ratio?: number;

    // Enhanced multi-modal fields
    multimodal_analysis_available?: boolean;
    acoustic_enhancement?: boolean;
    synchronization_quality?: number;
    empathy_acoustic_validation?: string;
    sentiment_acoustic_validation?: string;
    emotion_acoustic_correlation?: {
      text_emotion_match: number;
      acoustic_enhancement: string;
      confidence_boost: number;
    };
    vocal_authenticity_assessment?: {
      authenticity_score: number;
      voice_quality_indicators: string;
      emotional_coherence: string;
    };
    prosodic_insights?: {
      emphasis_effectiveness: number;
      delivery_confidence: number;
      vocal_engagement: number;
    };
    multimodal_confidence_scoring?: {
      text_confidence: number;
      acoustic_confidence: number;
      combined_confidence: number;
      enhancement_factor: number;
    };
    acoustic_confidence?: number;
    vocal_emotion_scores?: Record<string, number>;
  };
  hideHeaderMetrics?: boolean;
}

export default function AnalysisResults({ data, hideHeaderMetrics = false }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'emotions' | 'quotes' | 'transcript' | 'classification' | 'acoustic'>('overview');

  // Debug logging removed for production cleanliness

  // Check if this is a non-political speech
  const isNonPolitical = data.is_political === false;

  // Prepare emotion data for charts with proper validation
  const emotionChartData = Object.entries(data.emotion_distribution || {}).map(([emotion, value]) => ({
    name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
    value: Math.round(((value as number) || 0) * 100),
    fill: getEmotionColor(emotion)
  })).filter(item => item.value > 0); // Only show emotions with values > 0

  // Prepare word cloud data from key themes with validation
  const wordCloudData = (data.key_themes || []).map((theme, index) => ({
    text: theme,
    weight: Math.max(1, data.key_themes.length - index) // Ensure minimum weight of 1
  })).filter(item => item.text && item.text.trim().length > 0); // Filter out empty themes

  // Empathy score data for radial chart
  const empathyData = [
    {
      name: 'Empathy',
      value: data.empathy_score,
      fill: getEmpathyColor(data.empathy_score)
    }
  ];

  // Get empathy level description
  const getEmpathyLevel = (score: number) => {
    if (score >= 80) return { level: 'High', color: 'text-green-800', bgColor: 'bg-green-100' };
    if (score >= 60) return { level: 'Moderate-High', color: 'text-green-700', bgColor: 'bg-green-50' };
    if (score >= 40) return { level: 'Moderate', color: 'text-yellow-800', bgColor: 'bg-yellow-100' };
    if (score >= 20) return { level: 'Low-Moderate', color: 'text-yellow-700', bgColor: 'bg-yellow-50' };
    return { level: 'Low', color: 'text-red-800', bgColor: 'bg-red-100' };
  };

  const empathyLevel = getEmpathyLevel(data.empathy_score);

  // Get sentiment color
  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'positive') return 'text-green-800';
    if (sentiment === 'negative') return 'text-red-800';
    return 'text-gray-600';
  };

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Export results as JSON
  const handleExport = () => {
    const exportData = {
      ...data,
      export_date: new Date().toISOString(),
      export_version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${data.filename || 'results'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'classification', label: 'Classification', icon: Target },
    ...(isNonPolitical ? [] : [
      { id: 'emotions', label: 'Emotions', icon: Heart },
      { id: 'quotes', label: 'Key Quotes', icon: Quote }
    ]),
    ...(data.multimodal_analysis_available || data.acoustic_enhancement ? [
      { id: 'acoustic', label: 'Voice Analysis', icon: Mic }
    ] : []),
    { id: 'transcript', label: 'Transcript', icon: MessageCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header with metadata and optional metrics */}
      {!hideHeaderMetrics && (
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {data.filename && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {data.filename}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Languages className="h-4 w-4 mr-1" />
                    {data.language_detected.charAt(0).toUpperCase() + data.language_detected.slice(1)}
                  </div>
                  {data.duration_seconds && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Duration: {formatDuration(data.duration_seconds)}
                    </div>
                  )}
                  {data.processing_time_seconds && (
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Processed in {data.processing_time_seconds.toFixed(1)}s
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleExport}
                  className="btn-secondary text-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Classification Card */}
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className={`text-2xl font-bold ${
                  data.is_political ? 'text-black' : 'text-gray-700'
                }`}>
                  {data.is_political ? 'Political' : 'Non-Political'}
                </div>
                <div className="text-sm text-gray-600">Content Type</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((data.classification_confidence || 0) * 100)}% confidence
                </div>
              </div>

              {/* Empathy Score - only for political content */}
              {data.is_political !== false && data.empathy_score !== undefined && (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-black">{data.empathy_score || 0}</div>
                  <div className="text-sm text-gray-600">Empathy Score</div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 ${empathyLevel.bgColor} ${empathyLevel.color}`}>
                    {empathyLevel.level}
                  </div>
                </div>
              )}

              {/* Sentiment */}
              {data.overall_sentiment && (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <div className={`text-2xl font-bold ${getSentimentColor(data.overall_sentiment)}`}>
                    {data.overall_sentiment.charAt(0).toUpperCase() + data.overall_sentiment.slice(1)}
                  </div>
                  <div className="text-sm text-gray-600">Overall Sentiment</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Score: {((data.sentiment_score || 0) * 100).toFixed(0)}%
                  </div>
                </div>
              )}

              {/* Analysis Confidence */}
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-black">
                  {Math.round((data.analysis_confidence || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
                <div className="text-xs text-gray-500 mt-1">Analysis Quality</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto sticky top-16 bg-white z-10">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 px-2 sm:px-1 pb-0.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 inline mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Empathy Radial Chart */}
          {data.is_political !== false && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Empathy Analysis</h3>
              </div>
              <div className="card-body">
                <div className="h-56 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={empathyData}>
                      <RadialBar dataKey="value" cornerRadius={10} />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-2xl font-bold">
                        {data.empathy_score}
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {(data.empathy_quotes || []).slice(0, 3).map((quote, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-700">{quote.timestamp || 'N/A'}</span>
                        <span className="text-xs text-gray-500">Score: {quote.score || 0}</span>
                      </div>
                      <p className="text-gray-600 text-xs italic">
                        "{quote.text ? (quote.text.length > 120 ? quote.text.substring(0, 120) + '...' : quote.text) : 'No text available'}"
                      </p>
                      {quote.acoustic_support && (
                        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                          <div className="flex items-center text-blue-700 text-xs font-medium mb-1">
                            <Mic className="h-3 w-3 mr-1" />
                            Voice Support
                          </div>
                          <p className="text-xs text-blue-600">
                            {quote.acoustic_support.length > 80 ? quote.acoustic_support.substring(0, 80) + '...' : quote.acoustic_support}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!data.empathy_quotes || data.empathy_quotes.length === 0) && (
                    <p className="text-gray-500 text-center py-4 text-sm">No empathy quotes available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Key Themes */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Key Themes</h3>
              <p className="text-sm text-gray-600 mt-1">
                {wordCloudData.length > 0 ? 'Visual representation of main topics' : 'List of identified themes'}
              </p>
            </div>
            <div className="card-body">
              {wordCloudData.length > 3 ? (
                <div className="w-full">
                  <WordCloud words={wordCloudData} width={400} height={300} className="w-full" />
                </div>
              ) : (
                <div className="space-y-2">
                  {(data.key_themes || []).map((theme, index) => (
                    <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 capitalize">{theme}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                  {(!data.key_themes || data.key_themes.length === 0) && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-gray-500">No specific themes identified</p>
                      <p className="text-xs text-gray-400 mt-1">The analysis didn't detect distinct thematic patterns</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'classification' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classification Results */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Speech Classification</h3>
              <p className="text-sm text-gray-600 mt-1">
                AI-powered analysis to determine content type
              </p>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                {/* Main Classification */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold mb-4 ${
                    data.is_political
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {data.is_political ? '🏛️' : '💬'}
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${
                    data.is_political ? 'text-black' : 'text-gray-700'
                  }`}>
                    {data.is_political ? 'Political Speech' : 'Non-Political Content'}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">
                    {Math.round((data.classification_confidence || 0) * 100)}% Confidence
                  </div>

                  {/* Confidence Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className={`h-2 rounded-full ${
                        (data.classification_confidence || 0) > 0.8 ? 'bg-green-500' :
                        (data.classification_confidence || 0) > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.round((data.classification_confidence || 0) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Reasoning */}
                {data.classification_reasoning && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Classification Reasoning</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                      {data.classification_reasoning}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rhetoric Analysis - Only for political content */}
          {data.is_political && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Rhetoric Analysis</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Detected rhetorical strategies and techniques
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {/* Policy vs Emotion Ratio */}
                  {data.policy_vs_emotion_ratio !== undefined && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Policy vs Emotion Focus</span>
                        <span className="text-sm text-gray-500">
                          {Math.round(data.policy_vs_emotion_ratio * 100)}% Policy
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${Math.round(data.policy_vs_emotion_ratio * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Emotion-focused</span>
                        <span>Policy-focused</span>
                      </div>
                    </div>
                  )}

                  {/* Rhetoric Strategies */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Detected Strategies</h4>
                    <div className="space-y-2">
                      {(data.rhetoric_strategies || []).map((strategy, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700 font-medium">{strategy}</span>
                        </div>
                      ))}
                      {(!data.rhetoric_strategies || data.rhetoric_strategies.length === 0) && (
                        <p className="text-sm text-gray-500 italic">No specific rhetoric strategies detected</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Non-Political Message */}
          {!data.is_political && data.message && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Analysis Note</h3>
              </div>
              <div className="card-body">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">ℹ️</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-blue-800 text-sm">
                        {data.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'emotions' && !isNonPolitical && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emotion Distribution Bar Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Emotion Distribution</h3>
            </div>
            <div className="card-body">
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Intensity']} />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Emotion Pie Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Dominant Emotions</h3>
            </div>
            <div className="card-body">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {emotionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Intensity']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Positive Quotes */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Positive Quotes
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {data.positive_quotes && data.positive_quotes.length > 0 ? (
                  data.positive_quotes.map((quote, index) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-700">
                          🕰️ {quote.timestamp || 'N/A'}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          Score: {quote.score || 0}
                        </span>
                      </div>
                      <p className="text-gray-700 italic leading-relaxed">
                        "{quote.text || 'No text available'}"
                      </p>
                      {quote.voice_support && (
                        <div className="mt-3 p-2 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center text-green-700 text-xs font-medium mb-1">
                            <Volume2 className="h-3 w-3 mr-1" />
                            Voice Support
                          </div>
                          <p className="text-xs text-green-600">
                            {quote.voice_support}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">😊</div>
                    <p className="text-gray-500">No positive quotes identified</p>
                    <p className="text-xs text-gray-400 mt-1">No particularly positive sentiment detected in the speech</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Negative Quotes */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                Negative Quotes
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {data.negative_quotes && data.negative_quotes.length > 0 ? (
                  data.negative_quotes.map((quote, index) => (
                    <div key={index} className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 rounded-r-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-red-700">
                          🕰️ {quote.timestamp || 'N/A'}
                        </span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                          Score: {quote.score || 0}
                        </span>
                      </div>
                      <p className="text-gray-700 italic leading-relaxed">
                        "{quote.text || 'No text available'}"
                      </p>
                      {quote.voice_support && (
                        <div className="mt-3 p-2 bg-white rounded-lg border border-red-200">
                          <div className="flex items-center text-red-700 text-xs font-medium mb-1">
                            <Volume2 className="h-3 w-3 mr-1" />
                            Voice Support
                          </div>
                          <p className="text-xs text-red-600">
                            {quote.voice_support}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">😔</div>
                    <p className="text-gray-500">No negative quotes identified</p>
                    <p className="text-xs text-gray-400 mt-1">No particularly negative sentiment detected in the speech</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'acoustic' && (
        <div className="space-y-6">
          {/* Multi-Modal Analysis Status */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Voice Analysis Overview</h3>
              <p className="text-sm text-gray-600 mt-1">
                Enhanced multi-modal analysis combining text and voice characteristics
              </p>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${data.multimodal_analysis_available ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {data.multimodal_analysis_available ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Multi-Modal Analysis</div>
                    <div className="text-sm text-gray-500">
                      {data.multimodal_analysis_available ? 'Available' : 'Text-Only'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${data.acoustic_enhancement ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Waves className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Acoustic Enhancement</div>
                    <div className="text-sm text-gray-500">
                      {data.acoustic_enhancement ? 'Enhanced' : 'Basic'}
                    </div>
                  </div>
                </div>

                {data.synchronization_quality !== undefined && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100">
                      <Activity className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Sync Quality</div>
                      <div className="text-sm text-gray-500">
                        {Math.round(data.synchronization_quality * 100)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Empathy with Acoustic Validation */}
            {data.empathy_acoustic_validation && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Enhanced Empathy Analysis
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Empathy scoring validated by voice characteristics
                  </p>
                </div>
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-gray-900">{data.empathy_score}</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${empathyLevel.bgColor} ${empathyLevel.color}`}>
                      {empathyLevel.level} Empathy
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Voice Validation
                    </h4>
                    <p className="text-sm text-blue-800">
                      {data.empathy_acoustic_validation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Vocal Authenticity Assessment */}
            {data.vocal_authenticity_assessment && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Headphones className="h-5 w-5 mr-2 text-purple-500" />
                    Voice Authenticity
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Assessment of voice quality and genuineness
                  </p>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">Authenticity Score</span>
                        <span className="text-lg font-bold text-gray-900">
                          {Math.round(data.vocal_authenticity_assessment.authenticity_score * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                          style={{ width: `${Math.round(data.vocal_authenticity_assessment.authenticity_score * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {data.vocal_authenticity_assessment.voice_quality_indicators && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="font-medium text-gray-700 mb-1">Voice Quality</h5>
                        <p className="text-sm text-gray-600">
                          {data.vocal_authenticity_assessment.voice_quality_indicators}
                        </p>
                      </div>
                    )}

                    {data.vocal_authenticity_assessment.emotional_coherence && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="font-medium text-gray-700 mb-1">Emotional Coherence</h5>
                        <p className="text-sm text-gray-600">
                          {data.vocal_authenticity_assessment.emotional_coherence}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prosodic Insights */}
            {data.prosodic_insights && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    Speech Delivery Analysis
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Rhythm, emphasis, and vocal engagement patterns
                  </p>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Emphasis Effectiveness</span>
                        <span className="text-sm font-bold text-gray-900">
                          {Math.round(data.prosodic_insights.emphasis_effectiveness * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${Math.round(data.prosodic_insights.emphasis_effectiveness * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Delivery Confidence</span>
                        <span className="text-sm font-bold text-gray-900">
                          {Math.round(data.prosodic_insights.delivery_confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.round(data.prosodic_insights.delivery_confidence * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Vocal Engagement</span>
                        <span className="text-sm font-bold text-gray-900">
                          {Math.round(data.prosodic_insights.vocal_engagement * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-purple-500"
                          style={{ width: `${Math.round(data.prosodic_insights.vocal_engagement * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emotion Correlation */}
            {data.emotion_acoustic_correlation && (
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-pink-500" />
                    Text-Voice Correlation
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    How well voice characteristics match textual content
                  </p>
                </div>
                <div className="card-body">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {Math.round(data.emotion_acoustic_correlation.text_emotion_match * 100)}%
                      </div>
                      <div className="text-sm text-gray-600 mb-3">Text-Voice Match</div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500"
                          style={{ width: `${Math.round(data.emotion_acoustic_correlation.text_emotion_match * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-400">
                      <h5 className="font-medium text-pink-900 mb-2">Acoustic Enhancement</h5>
                      <p className="text-sm text-pink-800">
                        {data.emotion_acoustic_correlation.acoustic_enhancement}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Confidence Boost</span>
                      <span className="text-sm font-bold text-green-600">
                        +{Math.round(data.emotion_acoustic_correlation.confidence_boost * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Modal Confidence Scoring */}
          {data.multimodal_confidence_scoring && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
                  Analysis Confidence Breakdown
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Confidence levels across different analysis modes
                </p>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {Math.round(data.multimodal_confidence_scoring.text_confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Text Analysis</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {Math.round(data.multimodal_confidence_scoring.acoustic_confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Voice Analysis</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {Math.round(data.multimodal_confidence_scoring.combined_confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Combined</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      +{Math.round(data.multimodal_confidence_scoring.enhancement_factor * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Enhancement</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Quotes with Voice Support */}
          {data.empathy_quotes && data.empathy_quotes.some(q => q.acoustic_support) && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Quote className="h-5 w-5 mr-2 text-yellow-500" />
                  Voice-Enhanced Quotes
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Key quotes with acoustic validation
                </p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {data.empathy_quotes
                    .filter(quote => quote.acoustic_support)
                    .map((quote, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-800">{quote.timestamp || 'N/A'}</div>
                        <div className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Score: {quote.score}
                        </div>
                      </div>
                      <blockquote className="text-gray-700 italic mb-3">
                        "{quote.text}"
                      </blockquote>
                      <div className="bg-white rounded-lg p-3 border border-yellow-200">
                        <h5 className="font-medium text-yellow-900 mb-1 flex items-center">
                          <Mic className="h-4 w-4 mr-2" />
                          Voice Analysis
                        </h5>
                        <p className="text-sm text-yellow-800">
                          {quote.acoustic_support}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'transcript' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Full Transcript</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete speech transcript in {data.language_detected ? data.language_detected.charAt(0).toUpperCase() + data.language_detected.slice(1) : 'Unknown language'}
            </p>
            {data.transcript && (
              <div className="mt-2 text-xs text-gray-500">
                {data.transcript.length} characters | ~{Math.ceil(data.transcript.length / 5)} words
              </div>
            )}
          </div>
          <div className="card-body">
            {data.transcript ? (
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 max-h-72 sm:max-h-96 overflow-y-auto border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {data.transcript}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎤</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Transcript Available</h4>
                <p className="text-gray-600">
                  The speech could not be transcribed or no audio content was detected.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This might occur with very short recordings, poor audio quality, or non-speech content.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    hope: '#22c55e',
    anger: '#ef4444',
    fear: '#f97316',
    compassion: '#3b82f6',
    unity: '#8b5cf6',
    aggression: '#dc2626'
  };
  return colors[emotion] || '#6b7280';
}

function getEmpathyColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#84cc16';
  if (score >= 40) return '#eab308';
  if (score >= 20) return '#f97316';
  return '#ef4444';
}
