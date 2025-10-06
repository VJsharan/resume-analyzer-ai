import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, GitCompare, Calendar, User, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

interface Analysis {
  speech_id: string;
  filename: string;
  leader_name?: string;
  created_at: string;
  empathy_score?: number;
  duration_seconds: number;
  classification: string;
}

export default function ComparePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnalyses, setSelectedAnalyses] = useState<Analysis[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analyses from backend
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/v1/analyses?limit=100&classification=Political&sort_by=created_at&sort_order=-1`);

        if (!response.ok) {
          throw new Error('Failed to fetch analyses');
        }

        const data = await response.json();
        setAnalyses(data.analyses || []);
      } catch (err) {
        console.error('Error fetching analyses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analyses');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const filteredAnalyses = analyses.filter(
    analysis =>
      (analysis.leader_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (analysis.filename.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isSelected = (analysisId: string) => {
    return selectedAnalyses.some(a => a.speech_id === analysisId);
  };

  const toggleSelection = (analysis: Analysis) => {
    if (isSelected(analysis.speech_id)) {
      setSelectedAnalyses(selectedAnalyses.filter(a => a.speech_id !== analysis.speech_id));
    } else {
      if (selectedAnalyses.length < 4) {
        setSelectedAnalyses([...selectedAnalyses, analysis]);
      }
    }
  };

  const removeSelection = (analysisId: string) => {
    setSelectedAnalyses(selectedAnalyses.filter(a => a.speech_id !== analysisId));
  };

  const handleStartComparison = () => {
    if (selectedAnalyses.length >= 2) {
      // Pass selected speech IDs to results page
      const speechIds = selectedAnalyses.map(a => a.speech_id);
      navigate('/compare/results', { state: { speechIds, selectedAnalyses } });
    }
  };

  const canCompare = selectedAnalyses.length >= 2;
  const isMaxSelected = selectedAnalyses.length >= 4;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-black animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading analyses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Analyses</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
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
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Compare Analyses</h1>
          <p className="text-slate-600">Select and compare multiple speech analyses side by side</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Selection Panel */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by speaker or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* Analysis List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Available Analyses</h2>
                <span className="text-sm text-slate-500">
                  {filteredAnalyses.length} {filteredAnalyses.length === 1 ? 'result' : 'results'}
                </span>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredAnalyses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500">
                      {searchQuery ? 'No analyses found matching your search' : 'No political speeches available for comparison'}
                    </p>
                  </div>
                ) : (
                  filteredAnalyses.map((analysis) => {
                    const selected = isSelected(analysis.speech_id);
                    const disabled = !selected && isMaxSelected;

                    return (
                      <button
                        key={analysis.speech_id}
                        onClick={() => !disabled && toggleSelection(analysis)}
                        disabled={disabled}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selected
                            ? 'border-slate-900 bg-slate-50'
                            : disabled
                            ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">{analysis.filename}</h3>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              {analysis.leader_name && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {analysis.leader_name}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(analysis.created_at)}
                              </span>
                            </div>
                          </div>
                          {selected && (
                            <CheckCircle className="h-5 w-5 text-slate-900 flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
                          {analysis.empathy_score && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Empathy Score:</span>
                              <span className={`text-sm font-semibold ${
                                analysis.empathy_score >= 80 ? 'text-green-600' :
                                analysis.empathy_score >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {Math.round(analysis.empathy_score)}%
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Duration:</span>
                            <span className="text-sm font-semibold text-slate-700">{formatDuration(analysis.duration_seconds)}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Selected Analyses */}
          <div className="space-y-6">
            {/* Selection Status */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Selected Analyses</h2>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Selection Progress</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {selectedAnalyses.length} / 4
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedAnalyses.length / 4) * 100}%` }}
                  />
                </div>
                {selectedAnalyses.length < 2 && (
                  <p className="text-xs text-slate-500 mt-2">Select at least 2 analyses to compare</p>
                )}
              </div>

              {/* Selected Items */}
              <div className="space-y-2">
                {selectedAnalyses.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <GitCompare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No analyses selected yet</p>
                  </div>
                ) : (
                  selectedAnalyses.map((analysis, index) => (
                    <div
                      key={analysis.speech_id}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center justify-center w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{analysis.filename}</h3>
                        <p className="text-xs text-slate-600 truncate">{analysis.leader_name || 'Unknown Speaker'}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelection(analysis.speech_id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-900 transition-colors flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Start Comparison Button */}
            <button
              onClick={handleStartComparison}
              disabled={!canCompare}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg
                hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2
                disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <GitCompare className="h-5 w-5" />
              Start Comparison
            </button>

            {/* Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Comparison Includes</h3>
              <ul className="space-y-1 text-xs text-slate-600">
                <li>• Empathy score comparison</li>
                <li>• Sentiment breakdown analysis</li>
                <li>• Key themes overlap</li>
                <li>• Emotion distribution</li>
                <li>• Communication effectiveness</li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>• Compare speeches on similar topics for better insights</li>
                <li>• Select 2-3 analyses for clearer visualization</li>
                <li>• Use filters to find specific speeches quickly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
