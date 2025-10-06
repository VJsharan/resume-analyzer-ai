import { Download, FileText } from 'lucide-react';
import { downloadAnalysisPDF } from '../utils/api';
import SentimentTimeline from './charts/SentimentTimeline';
import EmotionalRadar from './charts/EmotionalRadar';
import TopicBreakdown from './charts/TopicBreakdown';
import RhetoricalAnalysis from './charts/RhetoricalAnalysis';
import CommunicationMetrics from './charts/CommunicationMetrics';
import CallToActionsList from './charts/CallToActionsList';
import ProsodyAnalysis from './charts/ProsodyAnalysis';

interface SinglePageAnalysisResultsProps {
  data: any;
  hideHeaderMetrics?: boolean;
}

export default function SinglePageAnalysisResults({ data, hideHeaderMetrics = false }: SinglePageAnalysisResultsProps) {
  // Debug: Log prosody data received
  console.log('📊 SinglePageAnalysisResults - Prosody Check:', {
    prosody_available: data.prosody_available,
    has_prosody_analysis: !!data.prosody_analysis,
    prosody_data: data.prosody_analysis ? {
      overall_metrics: !!data.prosody_analysis.overall_metrics,
      vocal_emotions: !!data.prosody_analysis.vocal_emotions
    } : null
  });

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment?: string) => {
    if (sentiment === 'positive') return 'text-green-800 bg-green-100 border-green-300';
    if (sentiment === 'negative') return 'text-red-800 bg-red-100 border-red-300';
    return 'text-gray-800 bg-gray-100 border-gray-300';
  };

  const getUrgencyColor = (level?: string) => {
    if (level === 'high') return 'text-red-800 bg-red-100 border-red-300';
    if (level === 'moderate') return 'text-yellow-800 bg-yellow-100 border-yellow-300';
    return 'text-green-800 bg-green-100 border-green-300';
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
    link.download = `analysis-${data.filename || 'results'}-${Date.now()}.json`;
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

  return (
    <div className="space-y-8">
      {/* Header Metrics - Only if not hidden */}
      {!hideHeaderMetrics && (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysis Complete</h2>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {data.overall_sentiment && (
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className={`text-lg font-bold px-3 py-1 rounded-lg inline-block border ${getSentimentColor(data.overall_sentiment)}`}>
                  {data.overall_sentiment.charAt(0).toUpperCase() + data.overall_sentiment.slice(1)}
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Sentiment ({Math.round((data.sentiment_score || 0.5) * 100)}%)
                </div>
              </div>
            )}

            {data.empathy_score !== undefined && (
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-bold text-purple-600">{data.empathy_score}</div>
                <div className="text-xs text-slate-600 mt-1">Empathy Score</div>
              </div>
            )}

            {data.authenticity_score !== undefined && (
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(data.authenticity_score * 100)}%
                </div>
                <div className="text-xs text-slate-600 mt-1">Authenticity</div>
              </div>
            )}

            {data.urgency_level && (
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className={`text-lg font-bold px-3 py-1 rounded-lg inline-block border ${getUrgencyColor(data.urgency_level)}`}>
                  {data.urgency_level.charAt(0).toUpperCase() + data.urgency_level.slice(1)}
                </div>
                <div className="text-xs text-slate-600 mt-2">Urgency Level</div>
              </div>
            )}

            {data.confidence_score !== undefined && (
              <div className="text-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(data.confidence_score * 100)}%
                </div>
                <div className="text-xs text-slate-600 mt-1">Confidence</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Grid - All Sections Visible */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Communication Metrics */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Communication Metrics</h3>
            <p className="text-purple-100 text-sm mt-1">Empathy, authenticity, and communication style</p>
          </div>
          <div className="p-6">
            <CommunicationMetrics
              empathyScore={data.empathy_score || 0}
              inclusivePhrases={data.inclusive_phrases || 0}
              egoCentricPhrases={data.ego_centric_phrases || 0}
              authenticityScore={data.authenticity_score || 0}
            />
          </div>
        </div>

        {/* Emotional Profile */}
        {data.emotional_profile && (
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Emotional Profile</h3>
              <p className="text-pink-100 text-sm mt-1">Distribution of emotions across the speech</p>
            </div>
            <div className="p-6">
              <div className="h-80">
                <EmotionalRadar data={data.emotional_profile} />
              </div>
            </div>
          </div>
        )}

        {/* Voice Prosody Analysis - NEW */}
        {data.prosody_available && data.prosody_analysis && (
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden lg:col-span-2">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-4">
              <h3 className="text-lg font-bold text-white">🎙️ Voice Tone Analysis</h3>
              <p className="text-indigo-100 text-sm mt-1">Vocal pitch, energy, and emotional delivery patterns</p>
            </div>
            <div className="p-6">
              <ProsodyAnalysis prosodyData={data.prosody_analysis} />
            </div>
          </div>
        )}

        {/* Topic Analysis */}
        {data.topic_breakdown && (
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Topic Analysis</h3>
              <p className="text-blue-100 text-sm mt-1">Emphasis on different political topics</p>
            </div>
            <div className="p-6">
              <div className="h-96">
                <TopicBreakdown data={data.topic_breakdown} />
              </div>
            </div>
          </div>
        )}

        {/* Key Themes */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Key Themes</h3>
            <p className="text-emerald-100 text-sm mt-1">Main topics identified in the speech</p>
          </div>
          <div className="p-6">
            {data.key_themes && data.key_themes.length > 0 ? (
              <div className="space-y-3">
                {data.key_themes.map((theme: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 hover:shadow-md transition-shadow"
                  >
                    <span className="font-medium text-emerald-900">{theme}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No themes identified</p>
            )}

            {data.political_positioning && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3">Political Positioning</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {data.political_positioning}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rhetorical Styles */}
        {data.rhetorical_styles && (
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Rhetorical Styles</h3>
              <p className="text-orange-100 text-sm mt-1">Persuasion techniques and patterns</p>
            </div>
            <div className="p-6">
              <RhetoricalAnalysis data={data.rhetorical_styles} />
            </div>
          </div>
        )}

        {/* Call to Actions */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden lg:col-span-2">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              ⚡ Call to Actions
            </h3>
            <p className="text-yellow-100 text-sm mt-1">Specific appeals and requests to audience</p>
          </div>
          <div className="p-6">
            <CallToActionsList actions={data.call_to_actions || []} />
          </div>
        </div>

        {/* Speech Timeline */}
        {data.speech_timeline && data.speech_timeline.length > 0 && (
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden lg:col-span-2">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white">Speech Timeline</h3>
              <p className="text-violet-100 text-sm mt-1">How sentiment and emotions evolved throughout</p>
            </div>
            <div className="p-6">
              <div className="h-96">
                <SentimentTimeline data={data.speech_timeline} />
              </div>
            </div>
          </div>
        )}

        {/* Transcript */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-lg overflow-hidden lg:col-span-2">
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4">
            <h3 className="text-lg font-bold text-white">Full Transcript</h3>
            <p className="text-slate-300 text-sm mt-1">
              Complete speech transcript
              {data.transcript && (
                <span className="ml-2">
                  • {data.transcript.length} characters • ~{Math.ceil(data.transcript.length / 5)} words
                </span>
              )}
            </p>
          </div>
          <div className="p-6">
            {data.transcript ? (
              <div className="bg-slate-50 rounded-xl p-6 max-h-96 overflow-y-auto border border-slate-200 shadow-inner">
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {data.transcript}
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎤</div>
                <p className="text-slate-500">No transcript available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
