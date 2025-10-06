import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClassificationDisplay, getClassificationStyle } from '../utils/analysis';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  FileVideo
} from 'lucide-react';

interface DashboardStats {
  total_analyses: number;
  political_speeches: number;
  non_political_content: number;
  average_empathy_score: number;
  recent_analyses: number;
  language_distribution: Array<{ _id: string; count: number }>;
}

interface AnalysisListItem {
  speech_id: string;
  filename: string;
  duration_seconds: number;
  language_detected: string;
  created_at: string;
  classification: string;
  confidence: number;
  leader_name?: string;
  empathy_score?: number;
  overall_sentiment?: string;
  key_themes: string[];
  status: string;
}

interface DashboardData {
  stats: DashboardStats | null;
  recentAnalyses: AnalysisListItem[];
  loading: boolean;
  error: string | null;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: null,
    recentAnalyses: [],
    loading: true,
    error: null
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

      // Fetch dashboard stats and recent analyses in parallel
      const [statsResponse, recentResponse] = await Promise.all([
        fetch(`${baseUrl}/api/v1/dashboard/stats`),
        fetch(`${baseUrl}/api/v1/dashboard/recent`)
      ]);

      if (!statsResponse.ok) {
        throw new Error(`Stats API error: ${statsResponse.status}`);
      }

      if (!recentResponse.ok) {
        throw new Error(`Recent analyses API error: ${recentResponse.status}`);
      }

      const stats = await statsResponse.json();
      const recentData = await recentResponse.json();

      setDashboardData({
        stats,
        recentAnalyses: recentData.recent_analyses || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data'
      }));
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);


  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };


  // Loading state
  if (dashboardData.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-black animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardData.error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-body">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
              <p className="text-gray-600 mb-4">{dashboardData.error}</p>
              <button
                onClick={fetchDashboardData}
                className="btn-primary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentAnalyses } = dashboardData;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Professional Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Navigation Header */}
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                Dashboard
              </h1>
              <p className="text-slate-300 text-sm sm:text-base">
                Real-time insights and analytics from political speech analysis
              </p>
            </div>
            
            {/* Enhanced CTA Section */}
            <div className="flex-shrink-0">
              <button
                onClick={() => navigate('/uploads')}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center shadow-lg text-sm sm:text-base"
              >
                <FileVideo className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Header with Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Dashboard Overview</h2>
            <p className="text-slate-600 text-sm sm:text-base">Monitor your analysis performance and recent activity</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Analytics Overview */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{stats?.total_analyses || 0}</div>
                  <div className="text-sm sm:text-base text-slate-600 font-medium">Total Analyses</div>
                  <div className="text-xs text-slate-500 mt-1">Videos processed</div>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{stats?.political_speeches || 0}</div>
                  <div className="text-sm sm:text-base text-slate-600 font-medium">Political Speeches</div>
                  <div className="text-xs text-slate-500 mt-1">Classified content</div>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg">
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{stats?.average_empathy_score?.toFixed(1) || '0.0'}</div>
                  <div className="text-sm sm:text-base text-slate-600 font-medium">Avg Empathy</div>
                  <div className="text-xs text-slate-500 mt-1">Empathy score</div>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{stats?.non_political_content || 0}</div>
                  <div className="text-sm sm:text-base text-slate-600 font-medium">Non-Political</div>
                  <div className="text-xs text-slate-500 mt-1">Other content</div>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recent Analyses</h2>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">
                Your latest analysis results
              </p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-sm hover:shadow-md"
            >
              View All
            </button>
          </div>
          
          {recentAnalyses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentAnalyses.slice(0, 3).map((analysis) => (
                <div
                  key={analysis.speech_id}
                  className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md p-4 sm:p-5 group transition-all duration-200 h-full flex flex-col min-h-[350px] sm:min-h-[400px]"
                >
                  {/* Header with Status and File Info */}
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(analysis.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 leading-relaxed line-clamp-2" title={analysis.filename}>
                          {analysis.filename.length > 60 ? `${analysis.filename.substring(0, 60)}...` : analysis.filename}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDuration(analysis.duration_seconds)} • {analysis.language_detected.charAt(0).toUpperCase() + analysis.language_detected.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Classification Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getClassificationStyle(analysis)}`}>
                      {getClassificationDisplay(analysis)}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">
                      {Math.round(analysis.confidence * 100)}% confidence
                    </p>
                  </div>

                  {/* Analysis Metrics */}
                  {analysis.empathy_score && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-700">Empathy Score</span>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{analysis.empathy_score.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-2.5 rounded-full transition-all duration-700 ${
                            analysis.empathy_score >= 70 ? 'bg-green-600' :
                            analysis.empathy_score >= 50 ? 'bg-yellow-600' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(analysis.empathy_score, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Key Themes - Better layout */}
                  {analysis.key_themes && analysis.key_themes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-slate-700 mb-2">Key Themes</p>
                      <div className="space-y-1.5">
                        {analysis.key_themes.slice(0, 3).map((theme, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                            <span className="text-xs text-slate-600 leading-relaxed flex-1">{theme}</span>
                          </div>
                        ))}
                        {analysis.key_themes.length > 3 && (
                          <div className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3 flex-shrink-0"></div>
                            <span className="text-xs text-slate-500 italic">+{analysis.key_themes.length - 3} more themes</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(analysis.created_at).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric',
                            timeZone: 'Asia/Kolkata'
                          })}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(analysis.created_at).toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'Asia/Kolkata'
                        })}
                      </span>
                    </div>
                    <button
                      className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-200"
                      onClick={() => navigate(`/analysis/${analysis.speech_id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">No analyses yet</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Start analyzing political speeches to see insights, empathy scores, and sentiment analysis here.
                </p>
                <button 
                  onClick={() => navigate('/uploads')} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
                >
                  <FileVideo className="h-5 w-5 mr-2" />
                  Upload First Video
                </button>
              </div>
            </div>
          )}
        </div>

        {/* System Performance Insights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">System Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Processing Performance */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Processing Performance</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-600">Live</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 font-medium">System Status</span>
                  <span className="text-emerald-600 font-semibold">Operational</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 font-medium">Avg Processing Time</span>
                  <span className="text-slate-900 font-semibold">2.5 min</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 font-medium">Success Rate</span>
                  <span className="text-slate-900 font-semibold">98.5%</span>
                </div>
              </div>
            </div>

            {/* Language Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Language Distribution</h3>
              <div className="space-y-4">
                {stats?.language_distribution?.map((lang) => (
                  <div key={lang._id} className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium capitalize">{lang._id || 'Unknown'}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-slate-700 h-2 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${Math.min((lang.count / (stats?.total_analyses || 1)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-slate-900 font-semibold min-w-[2rem] text-right">{lang.count}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No language data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




