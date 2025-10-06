import { useState } from 'react';
import {
  BarChart3,
  Heart,
  MessageCircle,
  Target,
  Quote,
  Download,
  Activity,
  Zap,
  Volume2,
  FileText
} from 'lucide-react';
import { downloadAnalysisPDF } from '../utils/api';
import SentimentTimeline from './charts/SentimentTimeline';
import EmotionalRadar from './charts/EmotionalRadar';
import TopicBreakdown from './charts/TopicBreakdown';
import RhetoricalAnalysis from './charts/RhetoricalAnalysis';
import CommunicationMetrics from './charts/CommunicationMetrics';
import CallToActionsList from './charts/CallToActionsList';
import ProsodyAnalysis from './charts/ProsodyAnalysis';

interface EnhancedAnalysisResultsProps {
  data: {
    filename?: string;
    duration_seconds?: number;
    language_detected: string;
    transcript: string;

    // New Enhanced Fields
    overall_sentiment?: string;
    sentiment_score?: number;
    sentiment_confidence?: number;
    emotional_profile?: {
      joy: number;
      fear: number;
      anger: number;
      hope: number;
      compassion: number;
      dominant_emotion: string;
    };
    empathy_score?: number;
    inclusive_phrases?: number;
    ego_centric_phrases?: number;
    authenticity_score?: number;
    rhetorical_styles?: {
      promises?: { count: number; examples: string[] };
      blame_opponents?: { count: number; examples: string[] };
      calls_to_unity?: { count: number; examples: string[] };
      visionary_statements?: { count: number; examples: string[] };
    };
    urgency_level?: string;
    topic_breakdown?: {
      development: number;
      health: number;
      education: number;
      employment: number;
      corruption: number;
      religion: number;
      security: number;
      economy: number;
    };
    key_themes?: string[];
    political_positioning?: string;
    call_to_actions?: Array<{
      timestamp: string;
      text: string;
      type: string;
    }>;
    speech_timeline?: Array<{
      timestamp: string;
      emotion: string;
      sentiment: number;
      topic: string;
    }>;
    visual_summary?: any;
    avg_engagement_score?: number;
    dominant_visual_emotion?: string;
    authenticity_indicators?: any;
    confidence_score?: number;
    processing_time_seconds?: number;
    is_political?: boolean;
    classification_confidence?: number;
    prosody_analysis?: {
      overall_metrics: {
        avg_pitch_hz: number;
        pitch_variability: number;
        avg_energy: number;
        pitch_range_hz: number;
        energy_dynamics: number;
      };
      vocal_emotions: {
        dominant_emotion: string;
        emotion_distribution: Record<string, number>;
      };
      features_extracted: number;
    };
    prosody_available?: boolean;
  };
  hideHeaderMetrics?: boolean;
}

export default function EnhancedAnalysisResults({ data, hideHeaderMetrics = false }: EnhancedAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'emotions' | 'topics' | 'rhetoric' | 'timeline' | 'prosody' | 'transcript'>('overview');

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment?: string) => {
    if (sentiment === 'positive') return 'text-green-800 bg-green-100';
    if (sentiment === 'negative') return 'text-red-800 bg-red-100';
    return 'text-gray-800 bg-gray-100';
  };

  const getUrgencyColor = (level?: string) => {
    if (level === 'high') return 'text-red-800 bg-red-100';
    if (level === 'moderate') return 'text-yellow-800 bg-yellow-100';
    return 'text-green-800 bg-green-100';
  };

  const handleExport = () => {
    const exportData = {
      ...data,
      export_date: new Date().toISOString(),
      export_version: '2.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced-analysis-${data.filename || 'results'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    try {
      if (data.speech_id) {
        await downloadAnalysisPDF(data.speech_id);
      } else {
        alert('Analysis ID not available for PDF download');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'emotions', label: 'Emotional Analysis', icon: Heart },
    { id: 'topics', label: 'Topic Analysis', icon: Target },
    { id: 'rhetoric', label: 'Rhetorical Styles', icon: Quote },
    { id: 'timeline', label: 'Speech Timeline', icon: Activity },
    ...(data.prosody_available ? [{ id: 'prosody', label: 'Voice Tone', icon: Volume2 }] : []),
    { id: 'transcript', label: 'Transcript', icon: MessageCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      {!hideHeaderMetrics && (
        <div className="card">
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Enhanced Analysis Complete</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {data.filename && <span>📁 {data.filename}</span>}
                  <span>🌐 {data.language_detected}</span>
                  {data.duration_seconds && <span>⏱️ {formatDuration(data.duration_seconds)}</span>}
                  {data.processing_time_seconds && <span>⚡ {data.processing_time_seconds.toFixed(1)}s</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleExport} className="btn-secondary text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  JSON
                </button>
                <button onClick={handleDownloadPDF} className="btn-primary text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </button>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Sentiment */}
              {data.overall_sentiment && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-xl font-bold px-3 py-1 rounded inline-block ${getSentimentColor(data.overall_sentiment)}`}>
                    {data.overall_sentiment.charAt(0).toUpperCase() + data.overall_sentiment.slice(1)}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Sentiment ({Math.round((data.sentiment_score || 0.5) * 100)}%)
                  </div>
                </div>
              )}

              {/* Empathy */}
              {data.empathy_score !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{data.empathy_score}</div>
                  <div className="text-xs text-gray-600 mt-1">Empathy Score</div>
                </div>
              )}

              {/* Authenticity */}
              {data.authenticity_score !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(data.authenticity_score * 100)}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Authenticity</div>
                </div>
              )}

              {/* Urgency */}
              {data.urgency_level && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-xl font-bold px-3 py-1 rounded inline-block ${getUrgencyColor(data.urgency_level)}`}>
                    {data.urgency_level.charAt(0).toUpperCase() + data.urgency_level.slice(1)}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Urgency Level</div>
                </div>
              )}

              {/* Confidence */}
              {data.confidence_score !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(data.confidence_score * 100)}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Analysis Confidence</div>
                </div>
              )}
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
          {/* Communication Metrics */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Communication Metrics</h3>
              <p className="text-sm text-gray-600 mt-1">Empathy, authenticity, and communication style</p>
            </div>
            <div className="card-body">
              <CommunicationMetrics
                empathyScore={data.empathy_score || 0}
                inclusivePhrases={data.inclusive_phrases || 0}
                egoCentricPhrases={data.ego_centric_phrases || 0}
                authenticityScore={data.authenticity_score || 0}
              />
            </div>
          </div>

          {/* Key Themes */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Key Themes</h3>
              <p className="text-sm text-gray-600 mt-1">Main topics identified in the speech</p>
            </div>
            <div className="card-body">
              {data.key_themes && data.key_themes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.key_themes.map((theme, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No themes identified</p>
              )}

              {data.political_positioning && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Political Positioning</h4>
                  <p className="text-sm text-gray-700">{data.political_positioning}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'emotions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emotional Radar */}
          {data.emotional_profile && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Emotional Profile</h3>
                <p className="text-sm text-gray-600 mt-1">Distribution of emotions across the speech</p>
              </div>
              <div className="card-body">
                <div className="h-80">
                  <EmotionalRadar data={data.emotional_profile} />
                </div>
              </div>
            </div>
          )}

          {/* Emotion Summary */}
          {data.emotional_profile && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Emotion Breakdown</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {Object.entries(data.emotional_profile)
                    .filter(([key]) => key !== 'dominant_emotion')
                    .map(([emotion, value]) => (
                      <div key={emotion}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium capitalize">{emotion}</span>
                          <span className="text-sm text-gray-600">{Math.round((value as number) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${(value as number) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Topic Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Emphasis on different political topics</p>
          </div>
          <div className="card-body">
            {data.topic_breakdown ? (
              <div className="h-96">
                <TopicBreakdown data={data.topic_breakdown} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No topic data available</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'rhetoric' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rhetorical Styles */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Rhetorical Styles</h3>
              <p className="text-sm text-gray-600 mt-1">Persuasion techniques and patterns</p>
            </div>
            <div className="card-body">
              {data.rhetorical_styles ? (
                <RhetoricalAnalysis data={data.rhetorical_styles} />
              ) : (
                <p className="text-gray-500 text-center py-8">No rhetorical data available</p>
              )}
            </div>
          </div>

          {/* Call to Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Call to Actions
              </h3>
              <p className="text-sm text-gray-600 mt-1">Specific appeals and requests to audience</p>
            </div>
            <div className="card-body">
              <CallToActionsList actions={data.call_to_actions || []} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Speech Timeline</h3>
            <p className="text-sm text-gray-600 mt-1">How sentiment and emotions evolved throughout the speech</p>
          </div>
          <div className="card-body">
            {data.speech_timeline && data.speech_timeline.length > 0 ? (
              <div className="h-96">
                <SentimentTimeline data={data.speech_timeline} />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No timeline data available</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'prosody' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Voice Prosody Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Analysis of vocal tone, pitch, energy, and emotional delivery</p>
          </div>
          <div className="card-body">
            <ProsodyAnalysis prosodyData={data.prosody_analysis} />
          </div>
        </div>
      )}

      {activeTab === 'transcript' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Full Transcript</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete speech transcript
            </p>
            {data.transcript && (
              <div className="mt-2 text-xs text-gray-500">
                {data.transcript.length} characters | ~{Math.ceil(data.transcript.length / 5)} words
              </div>
            )}
          </div>
          <div className="card-body">
            {data.transcript ? (
              <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {data.transcript}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">No transcript available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
