import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isPoliticalContent, getClassificationDisplay, getClassificationStyle } from '@/utils/analysis';
import {
  History as HistoryIcon,
  Search,
  Download,
  Trash2,
  FileText,
  Clock,
  Eye,
  BarChart3,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { listAnalyses, deleteAnalysis, formatApiError } from '@/utils/api';

interface AnalysisItem {
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

interface HistoryData {
  analyses: AnalysisItem[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<HistoryData>({
    analyses: [],
    loading: true,
    error: null,
    totalCount: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, political, non-political
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('date'); // date, empathy, confidence
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Fetch analyses from API
  const fetchAnalyses = async () => {
    try {
      setHistoryData(prev => ({ ...prev, loading: true, error: null }));

      const params: any = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sort_by: sortBy === 'date' ? 'created_at' : sortBy === 'empathy' ? 'empathy_score' : 'confidence',
        sort_order: -1 // Descending
      };

      if (selectedFilter !== 'all') {
        params.classification = selectedFilter === 'political' ? 'Political' : 'Not Political';
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await listAnalyses(params);

      setHistoryData({
        analyses: response.analyses,
        loading: false,
        error: null,
        totalCount: response.count
      });

    } catch (error) {
      console.error('Failed to fetch analyses:', error);
      setHistoryData(prev => ({
        ...prev,
        loading: false,
        error: formatApiError(error)
      }));
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchAnalyses();
  }, [currentPage, selectedFilter, sortBy]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchAnalyses();
      } else {
        setCurrentPage(1); // This will trigger fetchAnalyses through the other useEffect
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // For display purposes, work with current data
  const { analyses } = historyData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleSelectItem = (speechId: string) => {
    setSelectedItems(prev =>
      prev.includes(speechId)
        ? prev.filter(item => item !== speechId)
        : [...prev, speechId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === analyses.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(analyses.map(a => a.speech_id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} analyses?`)) {
      return;
    }

    try {
      // Delete selected analyses
      await Promise.all(selectedItems.map(speechId => deleteAnalysis(speechId)));
      
      // Clear selection and refetch data
      setSelectedItems([]);
      await fetchAnalyses();
      
      alert(`Successfully deleted ${selectedItems.length} analyses.`);
    } catch (error) {
      console.error('Failed to delete analyses:', error);
      alert(`Failed to delete analyses: ${formatApiError(error)}`);
    }
  };

  const handleDeleteSingle = async (speechId: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      await deleteAnalysis(speechId);
      await fetchAnalyses();
      alert('Analysis deleted successfully.');
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      alert(`Failed to delete analysis: ${formatApiError(error)}`);
    }
  };

  const handleBulkExport = () => {
    // In a real app, this would trigger a bulk export
    alert(`Exporting ${selectedItems.length} analyses...`);
  };

  const getEmpathyColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-green-50 text-green-700';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    if (score >= 20) return 'bg-yellow-50 text-yellow-700';
    return 'bg-red-100 text-red-800';
  };

  // Loading state
  if (historyData.loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-black animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analysis history...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (historyData.error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-body">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load History</h3>
              <p className="text-gray-600 mb-4">{historyData.error}</p>
              <button
                onClick={fetchAnalyses}
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Navigation Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 flex items-center">
                <HistoryIcon className="h-6 w-6 mr-3 text-slate-600" />
                Analysis History
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Browse and manage all your speech analysis records
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by filename..."
                  className="pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 w-full transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-3">
              <select
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Content</option>
                <option value="political">Political Only</option>
                <option value="non-political">Non-Political Only</option>
              </select>

              <select
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="empathy">Sort by Empathy</option>
                <option value="confidence">Sort by Confidence</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-6 flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-200">
              <span className="text-sm font-semibold text-slate-800">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={handleBulkExport}
                  className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 inline-flex items-center shadow-sm hover:shadow-md"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-white border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700 hover:text-red-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 inline-flex items-center shadow-sm hover:shadow-md"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Cards */}
        <div className="space-y-4">
          {/* Select All Header */}
          {analyses.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === analyses.length && analyses.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 mr-3 h-5 w-5"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    Select All ({analyses.length} analyses)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.speech_id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg p-5 group transition-all duration-200"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(analysis.speech_id)}
                      onChange={() => handleSelectItem(analysis.speech_id)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 mt-1 h-5 w-5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" />
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 break-words" title={analysis.filename}>
                          {analysis.filename}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center text-xs text-slate-500 mb-1 gap-x-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(analysis.duration_seconds)}
                        <span>• {analysis.language_detected}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatDate(analysis.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classification */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getClassificationStyle(analysis)}`}>
                    {getClassificationDisplay(analysis)}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    {Math.round(analysis.confidence * 100)}% confidence
                  </p>
                </div>

                {/* Analysis Results */}
                {isPoliticalContent(analysis) && (
                  <div className="mb-4 space-y-2">
                    {analysis.empathy_score && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">Empathy Score</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getEmpathyColor(analysis.empathy_score)}`}>
                          {analysis.empathy_score}%
                        </span>
                      </div>
                    )}
                    {analysis.overall_sentiment && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">Sentiment</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                          analysis.overall_sentiment === 'positive'
                            ? 'bg-emerald-100 text-emerald-800'
                            : analysis.overall_sentiment === 'negative'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {analysis.overall_sentiment}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Key Themes */}
                {analysis.key_themes && analysis.key_themes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-slate-700 mb-2">Key Themes</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.key_themes.slice(0, 3).map((theme, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                        >
                          {theme}
                        </span>
                      ))}
                      {analysis.key_themes.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{analysis.key_themes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex space-x-2">
                    <button
                      className="inline-flex items-center p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/analysis/${analysis.speech_id}`);
                      }}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="inline-flex items-center p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSingle(analysis.speech_id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {historyData.totalCount > itemsPerPage && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm text-slate-600 font-medium">
              Page {currentPage} of {Math.ceil(historyData.totalCount / itemsPerPage)}
            </div>
            <div className="flex space-x-3">
              <button
                className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage >= Math.ceil(historyData.totalCount / itemsPerPage)}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {analyses.length === 0 && !historyData.loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HistoryIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {searchQuery || selectedFilter !== 'all' ? 'No results found' : 'No analyses yet'}
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {searchQuery || selectedFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Upload your first political speech video to get started.'
                }
              </p>
              {!searchQuery && selectedFilter === 'all' && (
                <button 
                  onClick={() => navigate('/')} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Upload First Video
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
