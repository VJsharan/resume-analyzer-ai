import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Share2, ArrowLeft, RefreshCw, AlertCircle, Trophy, Medal, Award, TrendingUp, Heart, MessageSquare, CheckCircle2 } from 'lucide-react';
import ComparisonBarChart from '../components/charts/ComparisonBarChart';
import ComparisonRadarChart from '../components/charts/ComparisonRadarChart';
import DistributionPieChart from '../components/charts/DistributionPieChart';

interface ComparisonData {
  speeches: Array<{
    speech_id: string;
    filename: string;
    speaker?: string;
    language: string;
    duration_seconds: number;
    empathy_score?: number;
    sentiment_score?: number;
    overall_sentiment?: string;
  }>;
  comparison_metrics: {
    empathy_comparison: Array<{ speech_id: string; filename: string; empathy_score: number }>;
    empathy_leader?: string;
    empathy_range: { min: number; max: number; average: number };
    sentiment_distribution: Record<string, number>;
    sentiment_comparison: Array<{ speech_id: string; filename: string; sentiment: string; score: number }>;
    emotional_profiles: Array<{ speech_id: string; filename: string; profile: any }>;
    dominant_emotions: Record<string, string>;
    topic_distribution: Array<{ speech_id: string; filename: string; topics: Record<string, number> }>;
    common_themes: string[];
    topic_overlap: { common_themes: string[]; all_themes: string[] };
    rhetorical_comparison: Array<{ speech_id: string; filename: string; styles: any }>;
    most_used_styles: Record<string, number>;
    urgency_comparison: Array<{ speech_id: string; filename: string; urgency_level: string }>;
    authenticity_comparison: Array<{ speech_id: string; filename: string; authenticity_score: number }>;
  };
  insights: {
    key_insights: string[];
    differences: string[];
    similarities: string[];
    recommendations: string[];
  };
  comparison_date: string;
}

interface RankedSpeech {
  speech_id: string;
  filename: string;
  speaker?: string;
  rank: number;
  empathy_score: number;
  sentiment_score: number;
  overall_score: number;
  strengths: string[];
}

export default function CompareResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const speechIds = location.state?.speechIds || [];

  useEffect(() => {
    if (speechIds.length < 2) {
      setError('Please select at least 2 speeches to compare');
      setLoading(false);
      return;
    }

    const fetchComparison = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/v1/compare`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ speech_ids: speechIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comparison data');
        }

        const data = await response.json();
        setComparisonData(data);
      } catch (err) {
        console.error('Error fetching comparison:', err);
        setError(err instanceof Error ? err.message : 'Failed to load comparison');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [speechIds]);

  const handleExport = async () => {
    if (!comparisonData) return;

    setIsExporting(true);

    const exportData = {
      comparison_date: comparisonData.comparison_date,
      speeches: comparisonData.speeches,
      rankings: calculateRankings(),
      insights: comparisonData.insights,
      metrics: comparisonData.comparison_metrics
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparison_report_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setIsExporting(false);
  };

  const handleShare = () => {
    const shareText = `Comparison of ${comparisonData?.speeches.length} political speeches`;
    if (navigator.share) {
      navigator.share({ title: 'Speech Comparison', text: shareText });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const calculateRankings = (): RankedSpeech[] => {
    if (!comparisonData) return [];

    const ranked = comparisonData.speeches.map((speech) => {
      const empathyData = comparisonData.comparison_metrics.empathy_comparison.find(
        (e) => e.speech_id === speech.speech_id
      );
      const sentimentData = comparisonData.comparison_metrics.sentiment_comparison.find(
        (s) => s.speech_id === speech.speech_id
      );

      const empathyScore = empathyData?.empathy_score || 0;
      const sentimentScore = (sentimentData?.score || 0) * 100;
      const overallScore = (empathyScore * 0.6 + sentimentScore * 0.4);

      const strengths: string[] = [];
      if (empathyScore >= 80) strengths.push('High Empathy');
      if (sentimentScore >= 70) strengths.push('Positive Sentiment');
      if (comparisonData.comparison_metrics.empathy_leader === speech.filename) {
        strengths.push('Empathy Leader');
      }

      return {
        speech_id: speech.speech_id,
        filename: speech.filename,
        speaker: speech.speaker,
        rank: 0,
        empathy_score: empathyScore,
        sentiment_score: sentimentScore,
        overall_score: overallScore,
        strengths,
      };
    });

    ranked.sort((a, b) => b.overall_score - a.overall_score);
    ranked.forEach((speech, index) => {
      speech.rank = index + 1;
    });

    return ranked;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-slate-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-black animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Comparing speeches...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !comparisonData) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Comparison</h3>
              <p className="text-gray-600 mb-4">{error || 'No comparison data available'}</p>
              <button
                onClick={() => navigate('/compare')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { comparison_metrics, insights } = comparisonData;
  const rankings = calculateRankings();
  const winner = rankings[0];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/compare')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Selection
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Comparison Results</h1>
              <p className="text-slate-600">Comprehensive analysis and rankings of selected speeches</p>
            </div>

            <div className="flex gap-3 md:self-start md:mt-0">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export Report'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Winner Section */}
        {winner && (
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-400 rounded-full">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Top Performer</h2>
                <p className="text-slate-600">Based on empathy and sentiment analysis</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{winner.filename}</h3>
              {winner.speaker && <p className="text-sm text-slate-600 mb-3">{winner.speaker}</p>}

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{winner.empathy_score.toFixed(1)}</div>
                  <div className="text-xs text-slate-600">Empathy Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{winner.sentiment_score.toFixed(1)}</div>
                  <div className="text-xs text-slate-600">Sentiment Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{winner.overall_score.toFixed(1)}</div>
                  <div className="text-xs text-slate-600">Overall Score</div>
                </div>
              </div>

              {winner.strengths.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {winner.strengths.map((strength, idx) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {strength}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rankings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Complete Rankings</h2>
          <div className="space-y-3">
            {rankings.map((speech) => (
              <div
                key={speech.speech_id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  speech.rank === 1 ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadgeColor(speech.rank)}`}>
                  {getRankIcon(speech.rank)}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{speech.filename}</h3>
                  {speech.speaker && <p className="text-sm text-slate-600">{speech.speaker}</p>}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-semibold text-slate-900">{speech.empathy_score.toFixed(0)}</span>
                    </div>
                    <div className="text-xs text-slate-500">Empathy</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-semibold text-slate-900">{speech.sentiment_score.toFixed(0)}</span>
                    </div>
                    <div className="text-xs text-slate-500">Sentiment</div>
                  </div>
                  <div className="text-center px-3 py-1 bg-slate-100 rounded-lg">
                    <div className="text-lg font-bold text-slate-900">{speech.overall_score.toFixed(0)}</div>
                    <div className="text-xs text-slate-500">Total</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights - Compact Cards */}
        {insights && (insights.key_insights.length > 0 || insights.similarities.length > 0 || insights.differences.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {insights.key_insights.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-blue-900">Key Insights</h3>
                </div>
                <ul className="space-y-2">
                  {insights.key_insights.slice(0, 3).map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.similarities.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-green-900">Similarities</h3>
                </div>
                <ul className="space-y-2">
                  {insights.similarities.slice(0, 3).map((similarity, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{similarity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.differences.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-purple-900">Key Differences</h3>
                </div>
                <ul className="space-y-2">
                  {insights.differences.slice(0, 3).map((difference, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-purple-800">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{difference}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empathy Comparison */}
        {comparison_metrics.empathy_comparison.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
            {comparison_metrics.empathy_leader && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-900">
                  👑 Empathy Leader: {comparison_metrics.empathy_leader}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Average: {comparison_metrics.empathy_range.average.toFixed(1)} |
                  Range: {comparison_metrics.empathy_range.min.toFixed(1)} - {comparison_metrics.empathy_range.max.toFixed(1)}
                </p>
              </div>
            )}

            <ComparisonBarChart
              title="Empathy Score Comparison"
              data={comparison_metrics.empathy_comparison.map((item, index) => ({
                name: `Speech ${index + 1}`,
                empathy: Math.round(item.empathy_score),
                filename: item.filename
              }))}
              dataKeys={[
                { key: 'empathy', name: 'Empathy Score', color: '#3b82f6' }
              ]}
              yAxisLabel="Score (0-100)"
            />
          </div>
        )}

        {/* Sentiment Distribution */}
        {comparison_metrics.sentiment_distribution && Object.keys(comparison_metrics.sentiment_distribution).length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <DistributionPieChart
                  title="Overall Sentiment Distribution"
                  data={Object.entries(comparison_metrics.sentiment_distribution).map(([sentiment, count]) => ({
                    name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
                    value: count as number
                  }))}
                  colors={['#10b981', '#64748b', '#ef4444']}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">By Speech</h3>
                {comparison_metrics.sentiment_comparison.length > 0 && (
                  <div className="space-y-3">
                    {comparison_metrics.sentiment_comparison.map((item, index) => (
                      <div key={item.speech_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-slate-900">Speech {index + 1}</span>
                          <p className="text-xs text-slate-600 truncate">{item.filename}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ${
                            item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                            item.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {item.sentiment}
                          </span>
                          <span className="text-sm text-slate-600">{(item.score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Common Themes */}
        {comparison_metrics.common_themes && comparison_metrics.common_themes.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Common Themes</h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <h3 className="text-sm font-semibold text-green-900 mb-3">Shared Across Speeches:</h3>
              <div className="flex flex-wrap gap-2">
                {comparison_metrics.common_themes.map((theme, idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Emotional Profiles - Radar Chart */}
        {comparison_metrics.emotional_profiles && comparison_metrics.emotional_profiles.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
            {(() => {
              // Get all unique emotions across all profiles
              const allEmotions = new Set<string>();
              comparison_metrics.emotional_profiles.forEach(item => {
                if (item.profile) {
                  Object.keys(item.profile).filter(key => key !== 'dominant_emotion').forEach(emotion => {
                    allEmotions.add(emotion);
                  });
                }
              });

              // Transform data for radar chart
              const radarData = Array.from(allEmotions).map(emotion => {
                const dataPoint: any = { metric: emotion.charAt(0).toUpperCase() + emotion.slice(1) };
                comparison_metrics.emotional_profiles.forEach((item, index) => {
                  const value = item.profile && item.profile[emotion];
                  dataPoint[`speech${index + 1}`] = typeof value === 'number' ? Math.round(value * 100) : 0;
                });
                return dataPoint;
              });

              // Create dataKeys for each speech
              const dataKeys = comparison_metrics.emotional_profiles.map((_item, index) => ({
                key: `speech${index + 1}`,
                name: `Speech ${index + 1}`,
                color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]
              }));

              return radarData.length > 0 ? (
                <ComparisonRadarChart
                  title="Emotional Profiles Comparison"
                  data={radarData}
                  dataKeys={dataKeys}
                />
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
