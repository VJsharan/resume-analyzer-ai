import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import {
  ChevronUp,
  ChevronDown,
  FileText,
  Clock,
  Eye,
  Download,
  Trash2,
  Users,
  Target,
  Heart,
  TrendingUp
} from 'lucide-react';

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

interface EnhancedAnalysisTableProps {
  data: AnalysisItem[];
  loading?: boolean;
  selection: string[];
  onSelectionChange: (selection: string[]) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onView: (speechId: string) => void;
  onDownload: (speechId: string) => void;
  onDelete: (speechId: string) => void;
  className?: string;
}

type SortField = 'filename' | 'created_at' | 'classification' | 'empathy_score' | 'confidence';

interface SortState {
  field: SortField;
  direction: 'asc' | 'desc';
}

const EnhancedAnalysisTable: React.FC<EnhancedAnalysisTableProps> = ({
  data,
  loading = false,
  selection,
  onSelectionChange,
  onSort,
  onView,
  onDownload,
  onDelete,
  className = ''
}) => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'created_at',
    direction: 'desc'
  });

  const handleSort = (field: SortField) => {
    const newDirection = sortState.field === field && sortState.direction === 'desc' ? 'asc' : 'desc';
    setSortState({ field, direction: newDirection });
    onSort(field, newDirection);
  };

  const handleSelectAll = () => {
    if (selection.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(item => item.speech_id));
    }
  };

  const handleSelectItem = (speechId: string) => {
    if (selection.includes(speechId)) {
      onSelectionChange(selection.filter(id => id !== speechId));
    } else {
      onSelectionChange([...selection, speechId]);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getClassificationDisplay = (analysis: AnalysisItem) => {
    return analysis.classification === 'Political' ? 'Political' : 'Non-Political';
  };

  const getClassificationStyle = (analysis: AnalysisItem) => {
    return analysis.classification === 'Political'
      ? 'bg-primary-100 text-primary-800 border-primary-200'
      : 'bg-neutral-100 text-neutral-800 border-neutral-200';
  };

  const getEmpathyColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-success-500';
    if (score >= 40) return 'text-warning-600';
    if (score >= 20) return 'text-warning-500';
    return 'text-error-600';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'negative':
        return 'bg-error-100 text-error-800 border-error-200';
      case 'neutral':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th className="px-6 py-4 text-left">
      <button
        onClick={() => handleSort(field)}
        className="flex items-center space-x-1 text-xs font-medium text-neutral-600 uppercase tracking-wider hover:text-neutral-800 group"
      >
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 ${
              sortState.field === field && sortState.direction === 'asc'
                ? 'text-primary-600'
                : 'text-neutral-400 group-hover:text-neutral-600'
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 -mt-1 ${
              sortState.field === field && sortState.direction === 'desc'
                ? 'text-primary-600'
                : 'text-neutral-400 group-hover:text-neutral-600'
            }`}
          />
        </div>
      </button>
    </th>
  );

  if (loading) {
    return (
      <div className={`card-enterprise ${className}`}>
        <div className="card-body">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-sm text-neutral-600">Loading analysis data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`card-enterprise ${className}`}>
        <div className="card-body">
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900">No analyses found</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-enterprise ${className}`}>
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="table-enterprise">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={selection.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <SortableHeader field="filename">File Details</SortableHeader>
                <SortableHeader field="classification">Classification</SortableHeader>
                <SortableHeader field="empathy_score">Analysis Results</SortableHeader>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Key Themes
                </th>
                <SortableHeader field="created_at">Date</SortableHeader>
                <th className="px-6 py-4 text-center text-xs font-medium text-neutral-600 uppercase tracking-wider min-w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.map((analysis) => (
                <tr
                  key={analysis.speech_id}
                  className={`hover:bg-neutral-50 transition-colors duration-150 ${
                    selection.includes(analysis.speech_id) ? 'bg-primary-25' : ''
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selection.includes(analysis.speech_id)}
                      onChange={() => handleSelectItem(analysis.speech_id)}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>

                  {/* File Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900 truncate max-w-xs">
                          {analysis.filename}
                        </p>
                        <div className="flex items-center text-xs text-neutral-500 space-x-3 mt-1">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(analysis.duration_seconds)}
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-1 bg-secondary-500`} />
                            {analysis.language_detected}
                          </div>
                        </div>
                        {analysis.leader_name && (
                          <div className="flex items-center text-xs text-neutral-500 mt-1">
                            <Users className="w-3 h-3 mr-1" />
                            {analysis.leader_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Classification */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getClassificationStyle(analysis)}`}>
                        <Target className="w-3 h-3 mr-1" />
                        {getClassificationDisplay(analysis)}
                      </span>
                      <div className="flex items-center text-xs text-neutral-600">
                        <div className="w-full bg-neutral-200 rounded-full h-1.5 mr-2">
                          <div
                            className="bg-primary-500 h-1.5 rounded-full"
                            style={{ width: `${analysis.confidence * 100}%` }}
                          />
                        </div>
                        <span className="whitespace-nowrap">{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Analysis Results */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {analysis.classification === 'Political' ? (
                      <div className="space-y-2">
                        {analysis.empathy_score !== undefined && (
                          <div className="flex items-center space-x-2">
                            <Heart className={`w-4 h-4 ${getEmpathyColor(analysis.empathy_score)}`} />
                            <span className={`text-sm font-medium ${getEmpathyColor(analysis.empathy_score)}`}>
                              {analysis.empathy_score}/100
                            </span>
                          </div>
                        )}
                        {analysis.overall_sentiment && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSentimentColor(analysis.overall_sentiment)}`}>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {analysis.overall_sentiment}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-500">No analysis</span>
                    )}
                  </td>

                  {/* Key Themes */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {analysis.key_themes.slice(0, 2).map((theme, themeIndex) => (
                        <span
                          key={themeIndex}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800"
                        >
                          {theme}
                        </span>
                      ))}
                      {analysis.key_themes.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                          +{analysis.key_themes.length - 2}
                        </span>
                      )}
                      {analysis.key_themes.length === 0 && (
                        <span className="text-sm text-neutral-400">None</span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {formatDate(analysis.created_at)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onView(analysis.speech_id)}
                        className="p-1 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-all duration-150"
                        title="View Analysis"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownload(analysis.speech_id)}
                        className="p-1 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-150"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(analysis.speech_id)}
                        className="p-1 text-error-600 hover:text-error-800 hover:bg-error-50 rounded-lg transition-all duration-150"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
};

export default EnhancedAnalysisTable;