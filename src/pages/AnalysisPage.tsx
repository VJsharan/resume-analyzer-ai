import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  Calendar,
  Clock,
  Globe,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Heart,
  MessageCircle,
  TrendingUp,
  FileText,
  Target
} from 'lucide-react';
import { getAnalysis, deleteAnalysis, formatApiError } from '@/utils/api';
import { isPoliticalContent, getClassificationDisplay, getClassificationStyle } from '@/utils/analysis';
import SinglePageAnalysisResults from '@/components/SinglePageAnalysisResults';

interface AnalysisDetail {
  speech_id: string;
  filename: string;
  duration_seconds: number;
  language_detected: string;
  created_at: string;
  processing_time_seconds: number;
  classification: string;
  confidence: number;
  classification_reasoning: string;
  leader_name?: string;
  transcript: string;
  empathy_score?: number;
  empathy_quotes: Array<{
    timestamp: string;
    text: string;
    score: number;
  }>;
  dominant_emotions: string[];
  emotion_distribution: Record<string, number>;
  key_themes: string[];
  overall_sentiment?: string;
  sentiment_score?: number;
  positive_quotes: Array<{
    timestamp: string;
    text: string;
    score: number;
  }>;
  negative_quotes: Array<{
    timestamp: string;
    text: string;
    score: number;
  }>;
  rhetoric_strategies: string[];
  policy_vs_emotion_ratio?: number;
  timeline_analysis?: any;
  analysis_confidence?: number;
  status: string;
  error_message?: string;
  message?: string;
  is_political: boolean;
}

export default function AnalysisPage() {
  const { speechId } = useParams<{ speechId: string }>();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (speechId) {
      fetchAnalysis();
    }
  }, [speechId]);

  const fetchAnalysis = async () => {
    if (!speechId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalysis(speechId);
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to fetch analysis:', err);
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!speechId || !confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await deleteAnalysis(speechId);
      alert('Analysis deleted successfully.');
      navigate('/history');
    } catch (err) {
      console.error('Failed to delete analysis:', err);
      alert(`Failed to delete analysis: ${formatApiError(err)}`);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-black animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analysis details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-body">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Analysis</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={fetchAnalysis}
                  className="btn-primary"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="btn-secondary"
                >
                  Back to History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Not Found</h3>
          <p className="text-gray-600 mb-4">The requested analysis could not be found.</p>
          <button
            onClick={() => navigate('/history')}
            className="btn-primary"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Navigation Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center flex-1">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{analysis.filename}</h1>
                <p className="text-slate-600 text-sm mb-1">Detailed analysis results and insights</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 inline-flex items-center shadow-sm hover:shadow-md">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 inline-flex items-center shadow-sm hover:shadow-md">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={handleDelete}
                className="bg-white border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700 hover:text-red-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 inline-flex items-center shadow-sm hover:shadow-md"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

      {/* Quick Stats Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x divide-slate-200">
          <div className="flex items-center space-x-3 px-2">
            <div className={`p-2 rounded-lg ${getClassificationStyle(analysis)}`}>
              {isPoliticalContent(analysis) ? (
                <Target className="h-5 w-5" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Classification</div>
              <div className="text-sm font-bold text-slate-900">{getClassificationDisplay(analysis)}</div>
              <div className="text-xs text-slate-600">{Math.round(analysis.confidence * 100)}% confidence</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Duration</div>
              <div className="text-sm font-bold text-slate-900">{formatDuration(analysis.duration_seconds)}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-2">
            <Globe className="h-5 w-5 text-slate-400" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Language</div>
              <div className="text-sm font-bold text-slate-900 capitalize">{analysis.language_detected}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Processing Time</div>
              <div className="text-sm font-bold text-slate-900">{analysis.processing_time_seconds.toFixed(1)}s</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-2">
            <Calendar className="h-5 w-5 text-slate-400" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Date</div>
              <div className="text-sm font-bold text-slate-900">
                {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Clean Grid */}
      {isPoliticalContent(analysis) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {analysis.empathy_score !== undefined && (
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Empathy Score</div>
                  <div className="text-3xl font-bold text-purple-900">{analysis.empathy_score}</div>
                  <div className="text-xs text-purple-600 mt-1">out of 100</div>
                </div>
                <Heart className="h-10 w-10 text-purple-300" />
              </div>
            </div>
          )}
          {analysis.overall_sentiment && (
            <div className={`bg-gradient-to-br ${
              analysis.overall_sentiment === 'positive' ? 'from-green-50 to-white border-green-100' :
              analysis.overall_sentiment === 'negative' ? 'from-red-50 to-white border-red-100' :
              'from-yellow-50 to-white border-yellow-100'
            } rounded-xl border p-5 hover:shadow-lg transition-all`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                    analysis.overall_sentiment === 'positive' ? 'text-green-600' :
                    analysis.overall_sentiment === 'negative' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>Overall Sentiment</div>
                  <div className={`text-3xl font-bold capitalize ${
                    analysis.overall_sentiment === 'positive' ? 'text-green-900' :
                    analysis.overall_sentiment === 'negative' ? 'text-red-900' :
                    'text-yellow-900'
                  }`}>{analysis.overall_sentiment}</div>
                  {analysis.sentiment_score !== undefined && (
                    <div className={`text-xs mt-1 ${
                      analysis.overall_sentiment === 'positive' ? 'text-green-600' :
                      analysis.overall_sentiment === 'negative' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>{(analysis.sentiment_score * 100).toFixed(0)}% score</div>
                  )}
                </div>
                <MessageCircle className={`h-10 w-10 ${
                  analysis.overall_sentiment === 'positive' ? 'text-green-300' :
                  analysis.overall_sentiment === 'negative' ? 'text-red-300' :
                  'text-yellow-300'
                }`} />
              </div>
            </div>
          )}
          {analysis.key_themes && analysis.key_themes.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-5 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Key Themes</div>
                  <div className="text-3xl font-bold text-blue-900">{analysis.key_themes.length}</div>
                  <div className="text-xs text-blue-600 mt-1">topics covered</div>
                </div>
                <TrendingUp className="h-10 w-10 text-blue-300" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 mb-6">

        {/* Classification Reasoning - Only if exists */}
        {analysis.classification_reasoning && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="bg-blue-100 rounded p-1 mt-0.5">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Classification Reasoning</h4>
                <ReasoningBlock text={analysis.classification_reasoning} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Analysis Content */}
      {isPoliticalContent(analysis) ? (
        <div className="space-y-8">
          {/* Single Page Detailed Analysis Results */}
          <SinglePageAnalysisResults hideHeaderMetrics={true} data={analysis as any} />
        </div>
      ) : (
        /* Non-Political Content */
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <CheckCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Non-Political Content Detected</h3>
          <p className="text-slate-600 mb-4">
            This content was classified as non-political speech. No detailed political analysis was performed.
          </p>
          {analysis.message && (
            <div className="bg-slate-50 rounded-lg p-4 mt-4 border border-slate-200">
              <p className="text-sm text-slate-700">{analysis.message}</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

function ReasoningBlock({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 260;
  const needsTruncate = text.length > MAX_CHARS;
  const displayText = expanded || !needsTruncate ? text : text.slice(0, MAX_CHARS) + '...';
  return (
    <div className="mt-3 text-sm text-slate-600 text-left">
      <strong>Reasoning:</strong> {displayText}
      {needsTruncate && (
        <button
          className="ml-2 text-slate-900 font-semibold hover:underline"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
