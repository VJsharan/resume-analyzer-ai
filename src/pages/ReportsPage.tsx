import { useState } from 'react';
import { FileText, Download, Share2, Search, CheckSquare, Square, Calendar } from 'lucide-react';

type ReportType = 'single' | 'comparison' | 'speaker';
type ExportFormat = 'pdf' | 'csv' | 'json';

interface SelectedMetrics {
  empathy: boolean;
  sentiment: boolean;
  emotions: boolean;
  themes: boolean;
  transcript: boolean;
}

interface RecentReport {
  id: string;
  title: string;
  type: string;
  date: string;
  format: string;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('single');
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedMetrics, setSelectedMetrics] = useState<SelectedMetrics>({
    empathy: true,
    sentiment: true,
    emotions: true,
    themes: true,
    transcript: false,
  });

  // Mock data for analyses
  const mockAnalyses = [
    { id: '1', speaker: 'John Smith', title: 'Climate Policy Speech', date: '2025-09-28' },
    { id: '2', speaker: 'Jane Doe', title: 'Healthcare Reform Address', date: '2025-09-25' },
    { id: '3', speaker: 'Mike Johnson', title: 'Economic Recovery Plan', date: '2025-09-20' },
    { id: '4', speaker: 'Sarah Williams', title: 'Education Initiative', date: '2025-09-15' },
  ];

  const recentReports: RecentReport[] = [
    { id: '1', title: 'Climate Policy Analysis Report', type: 'Single Analysis', date: '2025-09-29', format: 'PDF' },
    { id: '2', title: 'Healthcare vs Economic Comparison', type: 'Comparison', date: '2025-09-27', format: 'CSV' },
    { id: '3', title: 'John Smith Speaker Profile', type: 'Speaker Profile', date: '2025-09-26', format: 'PDF' },
  ];

  const filteredAnalyses = mockAnalyses.filter(
    analysis =>
      analysis.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMetric = (metric: keyof SelectedMetrics) => {
    setSelectedMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert(`Report generated successfully! Format: ${exportFormat.toUpperCase()}`);
  };

  const handleDownloadReport = (reportId: string) => {
    alert(`Downloading report ${reportId}...`);
  };

  const handleShareReport = (reportId: string) => {
    alert(`Share link copied for report ${reportId}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reports Hub</h1>
          <p className="text-slate-600">Generate, download, and share comprehensive analysis reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Report Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Selection */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Report Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  <p className="text-xs text-slate-500">Detailed report for one speech</p>
                </button>

                <button
                  onClick={() => setReportType('comparison')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    reportType === 'comparison'
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <FileText className={`h-5 w-5 mb-2 ${reportType === 'comparison' ? 'text-slate-900' : 'text-slate-600'}`} />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Comparison</h3>
                  <p className="text-xs text-slate-500">Compare multiple speeches</p>
                </button>

                <button
                  onClick={() => setReportType('speaker')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    reportType === 'speaker'
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <FileText className={`h-5 w-5 mb-2 ${reportType === 'speaker' ? 'text-slate-900' : 'text-slate-600'}`} />
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Speaker Profile</h3>
                  <p className="text-xs text-slate-500">All speeches by speaker</p>
                </button>
              </div>
            </div>

            {/* Analysis Selection */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Analysis</h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by speaker or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
              </div>

              {/* Analysis List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredAnalyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    onClick={() => setSelectedAnalysis(analysis.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedAnalysis === analysis.id
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">{analysis.title}</h3>
                        <p className="text-xs text-slate-600">{analysis.speaker}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {analysis.date}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Selection */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Include Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(selectedMetrics).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => toggleMetric(key as keyof SelectedMetrics)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {value ? (
                      <CheckSquare className="h-5 w-5 text-slate-900" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400" />
                    )}
                    <span className={`font-medium text-sm capitalize ${value ? 'text-slate-900' : 'text-slate-500'}`}>
                      {key}
                    </span>
                  </button>
                ))}
              </div>
            </div>
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
              disabled={!selectedAnalysis || isGenerating}
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
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Report Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Format</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-900">{report.title}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{report.type}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{report.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {report.format}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadReport(report.id)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleShareReport(report.id)}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
