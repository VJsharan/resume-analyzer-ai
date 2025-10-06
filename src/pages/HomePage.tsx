import { useState } from 'react';
import VideoUpload from '../components/VideoUpload';
import SinglePageAnalysisResults from '../components/SinglePageAnalysisResults';
import { FileVideo, BarChart3, RefreshCw } from 'lucide-react';

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

interface AnalysisData {
  filename?: string;
  duration_seconds?: number;
  language_detected: string;
  transcript: string;
  empathy_score: number;
  empathy_quotes: Array<{
    timestamp: string;
    text: string;
    score: number;
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
  }>;
  negative_quotes: Array<{
    timestamp: string;
    text: string;
    score: number;
  }>;
  timeline_analysis?: TimelineAnalysis;
  analysis_confidence: number;
  processing_time_seconds?: number;
  no_speech_detected?: boolean;
  message?: string;
  // Voice Prosody Analysis (Phase 2.0)
  prosody_available?: boolean;
  prosody_analysis?: {
    overall_metrics: {
      avg_pitch_hz: number;
      pitch_range_hz: number;
      pitch_variability: number;
      avg_energy: number;
      energy_dynamics: number;
    };
    vocal_emotions: {
      dominant_emotion: string;
      emotion_distribution: Record<string, number>;
    };
    features_extracted: number;
  };
  // Additional modern fields
  emotional_profile?: Record<string, number>;
  topic_breakdown?: Record<string, number>;
  rhetorical_styles?: any;
  call_to_actions?: any[];
  speech_timeline?: any[];
  authenticity_score?: number;
  urgency_level?: string;
  confidence_score?: number;
  inclusive_phrases?: number;
  ego_centric_phrases?: number;
  political_positioning?: string;
}

export default function HomePage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setIsAnalyzing(false);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisData(null);
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Navigation Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Video Analysis</h1>
          <p className="text-slate-600">Upload and analyze political speech videos for insights</p>
        </div>

        {/* Main Content */}
        <div>
          {!analysisData && !isAnalyzing && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upload Card - Takes 2/3 of the space */}
              <div className="lg:col-span-2">
                <VideoUpload
                  onAnalysisStart={handleAnalysisStart}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </div>
              
              {/* Supported Formats & Features Card - Takes 1/3 of the space */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-lg h-full">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Supported Formats & Features
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Upload your political speech videos for comprehensive analysis
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center mb-2">
                        <FileVideo className="h-5 w-5 text-slate-600 mr-2" />
                        <p className="text-slate-700 font-semibold text-sm">
                          Video Formats
                        </p>
                      </div>
                      <p className="text-xs text-slate-600">
                        MP4, AVI, MOV, MKV, WMV (up to 500MB)
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center mb-2">
                        <BarChart3 className="h-5 w-5 text-slate-600 mr-2" />
                        <p className="text-slate-700 font-semibold text-sm">
                          Languages
                        </p>
                      </div>
                      <p className="text-xs text-slate-600">
                        Hindi, Marathi, English, Tamil
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center mb-2">
                        <RefreshCw className="h-5 w-5 text-slate-600 mr-2" />
                        <p className="text-slate-700 font-semibold text-sm">
                          Analysis Features
                        </p>
                      </div>
                      <p className="text-xs text-slate-600">
                        Empathy scoring, sentiment analysis, key themes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-lg">
              <div className="flex items-center justify-center mb-6">
                <RefreshCw className="h-8 w-8 text-slate-900 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Processing video...
              </h3>
              <p className="text-slate-600 text-sm">
                This may take a few minutes depending on file size
              </p>
            </div>
          )}

          {analysisData && (
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
                <button
                  onClick={resetAnalysis}
                  className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  New Analysis
                </button>
              </div>
              <SinglePageAnalysisResults data={analysisData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}