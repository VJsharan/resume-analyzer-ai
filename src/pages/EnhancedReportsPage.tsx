import { useState, useEffect } from 'react';
import { FileText, Download, Search, TrendingUp, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import {
  getReportsDashboardStats,
  getTrendAnalysis,
  generateReport,
  listAnalyses
} from '../utils/api';
import TrendsChart from '../components/charts/TrendsChart';
import DistributionPieChart from '../components/charts/DistributionPieChart';

type ReportType = 'dashboard' | 'single' | 'trends';
type ExportFormat = 'pdf' | 'csv' | 'json';

interface DashboardStats {
  total_analyses: number;
  political_speeches: number;
  avg_empathy_score: number;
  empathy_distribution: { high: number; medium: number; low: number };
  sentiment_trends: { positive: number; negative: number; neutral: number };
  topic_popularity: Array<{ topic: string; count: number }>;
  top_speakers: Array<{ speaker: string; speech_count: number; avg_empathy: number }>;
}

// Helper function to convert report to CSV
const convertToCSV = (report: any): string => {
  const rows: string[] = [];

  // For single analysis export
  if (report.report_type === 'single') {
    rows.push('Field,Value');
    rows.push(`Filename,"${report.filename || 'N/A'}"`);
    rows.push(`Speaker,"${report.leader_name || 'Unknown'}"`);
    rows.push(`Language,${report.language_detected || 'N/A'}`);
    rows.push(`Duration (seconds),${report.duration_seconds || 0}`);
    rows.push('');

    rows.push('Analysis Results');
    rows.push(`Empathy Score,${report.empathy_score || report.analysis?.empathy_score || 0}`);
    rows.push(`Overall Sentiment,"${report.overall_sentiment || report.analysis?.overall_sentiment || 'N/A'}"`);
    rows.push(`Sentiment Score,${report.sentiment_score || report.analysis?.sentiment_score || 0}`);
    rows.push(`Authenticity Score,${report.authenticity_score || report.analysis?.authenticity_score || 0}`);
    rows.push('');

    if (report.key_themes || report.analysis?.key_themes) {
      rows.push('Key Themes');
      const themes = report.key_themes || report.analysis?.key_themes || [];
      themes.forEach((theme: string) => rows.push(`"${theme}"`));
      rows.push('');
    }
  } else {
    // Generic report format
    rows.push('Report ID,Report Type,Generated At');
    rows.push(`${report.report_id},${report.report_type},${report.generated_at}`);
    rows.push('');

    if (report.data && report.data.total_analyses !== undefined) {
      rows.push('Statistics');
      rows.push(`Total Analyses,${report.data.total_analyses}`);
      rows.push(`Political Speeches,${report.data.political_speeches || 0}`);
      rows.push(`Avg Empathy Score,${report.data.avg_empathy_score || 0}`);
    }
  }

  return rows.join('\n');
};

// Helper function to format report for PDF (text format for now)
const formatForPDF = (report: any): string => {
  const lines: string[] = [];

  lines.push('='.repeat(70));
  lines.push(`SPEECH ANALYSIS REPORT - ${(report.report_type || 'ANALYSIS').toUpperCase()}`);
  lines.push('='.repeat(70));
  lines.push('');

  // For single analysis
  if (report.report_type === 'single') {
    lines.push('SPEECH INFORMATION');
    lines.push('-'.repeat(70));
    lines.push(`Filename: ${report.filename || 'N/A'}`);
    lines.push(`Speaker: ${report.leader_name || 'Unknown'}`);
    lines.push(`Language: ${report.language_detected || 'N/A'}`);
    lines.push(`Duration: ${report.duration_seconds ? `${report.duration_seconds.toFixed(1)}s` : 'N/A'}`);
    lines.push(`Analysis Date: ${new Date(report.created_at || report.generated_at).toLocaleString()}`);
    lines.push('');

    lines.push('ANALYSIS METRICS');
    lines.push('-'.repeat(70));
    const empathy = report.empathy_score || report.analysis?.empathy_score || 0;
    lines.push(`Empathy Score: ${typeof empathy === 'number' ? empathy.toFixed(1) : empathy}/100`);
    lines.push(`Overall Sentiment: ${report.overall_sentiment || report.analysis?.overall_sentiment || 'N/A'}`);
    const sentiment = report.sentiment_score || report.analysis?.sentiment_score || 0;
    lines.push(`Sentiment Score: ${typeof sentiment === 'number' ? (sentiment * 100).toFixed(1) : sentiment}%`);
    const authenticity = report.authenticity_score || report.analysis?.authenticity_score || 0;
    lines.push(`Authenticity Score: ${typeof authenticity === 'number' ? (authenticity * 100).toFixed(1) : authenticity}%`);
    lines.push('');

    const themes = report.key_themes || report.analysis?.key_themes || [];
    if (themes.length > 0) {
      lines.push('KEY THEMES');
      lines.push('-'.repeat(70));
      themes.forEach((theme: string, idx: number) => {
        lines.push(`${idx + 1}. ${theme}`);
      });
      lines.push('');
    }

    if (report.transcript) {
      lines.push('TRANSCRIPT');
      lines.push('-'.repeat(70));
      lines.push(report.transcript.substring(0, 500) + '...');
      lines.push('');
    }
  } else {
    // Generic report
    lines.push(`Report ID: ${report.report_id}`);
    lines.push(`Generated: ${new Date(report.generated_at).toLocaleString()}`);
    lines.push('');

    if (report.data) {
      lines.push('REPORT DATA');
      lines.push('-'.repeat(70));
      lines.push(JSON.stringify(report.data, null, 2));
    }
  }

  lines.push('');
  lines.push('='.repeat(70));
  lines.push('END OF REPORT');
  lines.push('='.repeat(70));

  return lines.join('\n');
};

export default function EnhancedReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  // Dashboard data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  // Single analysis data
  const [availableAnalyses, setAvailableAnalyses] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Trends data
  const [trendDays, setTrendDays] = useState(30);
  const [trendsData, setTrendsData] = useState<any>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load available analyses
      const analysesResponse = await listAnalyses({ limit: 100, classification: 'Political' });
      setAvailableAnalyses(analysesResponse.analyses);

      // Load dashboard stats by default
      const stats = await getReportsDashboardStats();
      setDashboardStats(stats);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Load data based on report type
  useEffect(() => {
    if (reportType === 'dashboard' && !dashboardStats) {
      loadDashboardData();
    }
  }, [reportType]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const stats = await getReportsDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendsData = async (days: number) => {
    try {
      setLoading(true);
      setError(null);
      const trends = await getTrendAnalysis({ days, metrics: ['empathy', 'sentiment'] });
      setTrendsData(trends);
    } catch (err) {
      console.error('Error loading trends:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trend analysis');
      setTrendsData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      let reportData: any;

      // For single analysis, fetch actual analysis data
      if (reportType === 'single' && selectedAnalysis) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/v1/analysis/${selectedAnalysis}`);
        if (!response.ok) throw new Error('Failed to fetch analysis');
        reportData = await response.json();
        reportData.report_id = selectedAnalysis;
        reportData.report_type = 'single';
        reportData.generated_at = new Date().toISOString();
      } else {
        // For other report types, use the API
        const request: any = {
          report_type: reportType,
          format: exportFormat,
          metrics: ['empathy', 'sentiment', 'emotions', 'topics']
        };

        if (reportType === 'trends') {
          request.date_range = {
            start: new Date(Date.now() - trendDays * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          };
        }

        reportData = await generateReport(request);
      }

      // Handle different export formats
      let dataBlob: Blob;
      let filename: string;
      const selectedAnalysisData = availableAnalyses.find(a => a.speech_id === selectedAnalysis);
      const filenameBase = selectedAnalysisData?.filename?.replace(/\.[^/.]+$/, "") || `analysis_${selectedAnalysis}`;

      if (exportFormat === 'csv') {
        // Convert to CSV format
        const csvData = convertToCSV(reportData);
        dataBlob = new Blob([csvData], { type: 'text/csv' });
        filename = `${filenameBase}_report.csv`;
      } else if (exportFormat === 'pdf') {
        // For PDF, we'll create a formatted text version
        const pdfText = formatForPDF(reportData);
        dataBlob = new Blob([pdfText], { type: 'text/plain' });
        filename = `${filenameBase}_report.txt`;
        alert('PDF with charts coming soon! Downloading as formatted text for now.');
      } else {
        // JSON format (default)
        const dataStr = JSON.stringify(reportData, null, 2);
        dataBlob = new Blob([dataStr], { type: 'application/json' });
        filename = `${filenameBase}_report.json`;
      }

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredAnalyses = availableAnalyses.filter(
    analysis =>
      analysis.leader_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
          <p className="text-slate-600">Generate comprehensive reports with real-time data and insights</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Report Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Selection */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Report Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setReportType('dashboard')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    reportType === 'dashboard'
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <BarChart3 className={`h-5 w-5 mb-2 ${reportType === 'dashboard' ? 'text-slate-900' : 'text-slate-600'}`} />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Dashboard</h3>
                  <p className="text-xs text-slate-500">Overall statistics</p>
                </button>

                <button
                  onClick={() => setReportType('single')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    reportType === 'single'
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <FileText className={`h-5 w-5 mb-2 ${reportType === 'single' ? 'text-slate-900' : 'text-slate-600'}`} />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Single Analysis</h3>
                  <p className="text-xs text-slate-500">One speech report</p>
                </button>

                <button
                  onClick={() => {
                    setReportType('trends');
                    if (!trendsData) loadTrendsData(trendDays);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    reportType === 'trends'
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <TrendingUp className={`h-5 w-5 mb-2 ${reportType === 'trends' ? 'text-slate-900' : 'text-slate-600'}`} />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Trends</h3>
                  <p className="text-xs text-slate-500">Time-based analysis</p>
                </button>
              </div>
            </div>

            {/* Dashboard Report View */}
            {reportType === 'dashboard' && dashboardStats && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">Dashboard Statistics</h2>
                  <button
                    onClick={loadDashboardData}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{dashboardStats.total_analyses}</div>
                    <div className="text-sm text-slate-600">Total Analyses</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{dashboardStats.political_speeches}</div>
                    <div className="text-sm text-slate-600">Political Speeches</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{dashboardStats.avg_empathy_score.toFixed(1)}</div>
                    <div className="text-sm text-slate-600">Avg Empathy Score</div>
                  </div>
                </div>

                {/* Empathy Distribution - Pie Chart */}
                <div className="mb-6">
                  <DistributionPieChart
                    title="Empathy Distribution"
                    data={[
                      { name: 'High (≥80%)', value: dashboardStats.empathy_distribution.high },
                      { name: 'Medium (60-79%)', value: dashboardStats.empathy_distribution.medium },
                      { name: 'Low (<60%)', value: dashboardStats.empathy_distribution.low }
                    ]}
                    colors={['#10b981', '#f59e0b', '#ef4444']}
                  />
                </div>

                {/* Sentiment Distribution - Pie Chart */}
                <div className="mb-6">
                  <DistributionPieChart
                    title="Sentiment Distribution"
                    data={[
                      { name: 'Positive', value: dashboardStats.sentiment_trends.positive },
                      { name: 'Neutral', value: dashboardStats.sentiment_trends.neutral },
                      { name: 'Negative', value: dashboardStats.sentiment_trends.negative }
                    ]}
                    colors={['#10b981', '#64748b', '#ef4444']}
                  />
                </div>

                {/* Top Topics */}
                {dashboardStats.topic_popularity && dashboardStats.topic_popularity.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Top Topics</h3>
                    <div className="space-y-2">
                      {dashboardStats.topic_popularity.slice(0, 5).map((topic, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-sm text-slate-900">{topic.topic}</span>
                          <span className="text-sm font-medium text-slate-600">{topic.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Speakers */}
                {dashboardStats.top_speakers && dashboardStats.top_speakers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Top Speakers</h3>
                    <div className="space-y-2">
                      {dashboardStats.top_speakers.map((speaker, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{speaker.speaker}</div>
                            <div className="text-xs text-slate-600">{speaker.speech_count} speeches</div>
                          </div>
                          <div className="text-sm font-medium text-slate-600">
                            Empathy: {speaker.avg_empathy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Speaker Report View */}

            {/* Single Analysis View */}
            {reportType === 'single' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Analysis</h2>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by speaker or filename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                {/* Analysis List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredAnalyses.map((analysis) => (
                    <button
                      key={analysis.speech_id}
                      onClick={() => setSelectedAnalysis(analysis.speech_id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedAnalysis === analysis.speech_id
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 text-sm mb-1">{analysis.filename}</h3>
                          <p className="text-xs text-slate-600">{analysis.leader_name || 'Unknown speaker'}</p>
                        </div>
                        {analysis.empathy_score && (
                          <div className="text-sm font-medium text-slate-900">
                            {Math.round(analysis.empathy_score)}%
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trends View */}
            {reportType === 'trends' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">Trend Analysis</h2>
                  <button
                    onClick={() => loadTrendsData(trendDays)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                {/* Time Range Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-900 mb-2">Time Period</label>
                  <select
                    value={trendDays}
                    onChange={(e) => {
                      setTrendDays(Number(e.target.value));
                      loadTrendsData(Number(e.target.value));
                    }}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                    <option value={180}>Last 6 months</option>
                    <option value={365}>Last year</option>
                  </select>
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 text-slate-900 animate-spin mx-auto mb-2" />
                    <p className="text-slate-600">Loading trend data...</p>
                  </div>
                )}

                {trendsData && !loading && (
                  <div className="space-y-6">
                    {/* Key Trends */}
                    {trendsData.key_trends && trendsData.key_trends.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Key Insights</h3>
                        <ul className="space-y-2">
                          {trendsData.key_trends.map((trend: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-slate-400 mt-0.5">•</span>
                              {trend}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Empathy Over Time - Line Chart */}
                    {trendsData.empathy_over_time && trendsData.empathy_over_time.length > 0 && (
                      <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <TrendsChart
                          data={trendsData.empathy_over_time}
                          dataKey="value"
                          title="Empathy Scores Over Time"
                          color="#3b82f6"
                          type="area"
                        />
                      </div>
                    )}

                    {/* Sentiment Over Time - If available */}
                    {trendsData.sentiment_over_time && trendsData.sentiment_over_time.length > 0 && (
                      <div className="bg-white rounded-lg border border-slate-200 p-4 mt-6">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Sentiment Distribution Over Time</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {trendsData.sentiment_over_time.slice(-15).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs">
                              <span className="text-slate-700">{item.date}</span>
                              <span className={`font-medium px-2 py-1 rounded ${
                                item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                                item.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                'bg-slate-100 text-slate-800'
                              }`}>
                                {item.sentiment} ({item.count})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Export & Actions */}
          <div className="space-y-6">
            {/* Export Format */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Export Format</h2>
              <div className="space-y-2">
                {(['pdf', 'csv', 'json'] as ExportFormat[]).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      exportFormat === format
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-semibold text-slate-900 uppercase text-sm">{format}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              disabled={
                isGenerating ||
                (reportType === 'single' && !selectedAnalysis)
              }
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg
                hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2
                disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-5 w-5" />
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>

            {/* Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Report Contents</h3>
              <ul className="space-y-1 text-xs text-slate-600">
                <li>• Executive summary</li>
                <li>• Selected metrics analysis</li>
                <li>• Visual charts and graphs</li>
                <li>• Key insights and recommendations</li>
                {reportType === 'dashboard' && <li>• Overall platform statistics</li>}
                {reportType === 'trends' && <li>• Time-based trend analysis</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
