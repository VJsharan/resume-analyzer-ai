import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  X,
  Languages,
  Target,
  Gauge
} from 'lucide-react';

interface SearchFilters {
  query: string;
  dateRange: [Date, Date] | null;
  languages: string[];
  classification: 'all' | 'political' | 'non-political';
  confidenceRange: [number, number];
  empathyRange: [number, number];
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  filters,
  onFiltersChange,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const availableLanguages = [
    { code: 'hindi', name: 'Hindi' },
    { code: 'english', name: 'English' },
    { code: 'tamil', name: 'Tamil' },
    { code: 'marathi', name: 'Marathi' },
    { code: 'bengali', name: 'Bengali' },
    { code: 'telugu', name: 'Telugu' },
    { code: 'gujarati', name: 'Gujarati' }
  ];

  const classificationOptions = [
    { value: 'all', label: 'All Content' },
    { value: 'political', label: 'Political Only' },
    { value: 'non-political', label: 'Non-Political Only' }
  ];

  const handleQueryChange = (query: string) => {
    onFiltersChange({ ...filters, query });
  };

  const handleClassificationChange = (classification: SearchFilters['classification']) => {
    onFiltersChange({ ...filters, classification });
  };

  const toggleLanguage = (languageCode: string) => {
    const newLanguages = filters.languages.includes(languageCode)
      ? filters.languages.filter(lang => lang !== languageCode)
      : [...filters.languages, languageCode];
    onFiltersChange({ ...filters, languages: newLanguages });
  };

  const handleConfidenceRangeChange = (range: [number, number]) => {
    onFiltersChange({ ...filters, confidenceRange: range });
  };

  const handleEmpathyRangeChange = (range: [number, number]) => {
    onFiltersChange({ ...filters, empathyRange: range });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      dateRange: null,
      languages: [],
      classification: 'all',
      confidenceRange: [0, 100],
      empathyRange: [0, 100]
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query.trim()) count++;
    if (filters.dateRange) count++;
    if (filters.languages.length > 0) count++;
    if (filters.classification !== 'all') count++;
    if (filters.confidenceRange[0] > 0 || filters.confidenceRange[1] < 100) count++;
    if (filters.empathyRange[0] > 0 || filters.empathyRange[1] < 100) count++;
    return count;
  };

  return (
    <div className={`card-enterprise ${className}`}>
      <div className="card-body">
        {/* Main Search Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by filename, content, speaker..."
              className="w-full pl-10 pr-4 py-3 border-2 border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              value={filters.query}
              onChange={(e) => handleQueryChange(e.target.value)}
            />
          </div>

          {/* Classification Filter */}
          <div className="relative">
            <select
              className="appearance-none border-2 border-neutral-200 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white cursor-pointer"
              value={filters.classification}
              onChange={(e) => handleClassificationChange(e.target.value as SearchFilters['classification'])}
            >
              {classificationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
              isExpanded
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {isExpanded && (
          <div className="border-t border-neutral-100 pt-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Date Range */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-neutral-700">
                  <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="border-2 border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    className="border-2 border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-neutral-700">
                  <Languages className="h-4 w-4 mr-2 text-neutral-500" />
                  Languages
                </label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {availableLanguages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        filters.languages.includes(lang.code)
                          ? 'bg-primary-100 text-primary-800 border-2 border-primary-200'
                          : 'bg-neutral-100 text-neutral-700 border-2 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confidence Range */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-neutral-700">
                  <Target className="h-4 w-4 mr-2 text-neutral-500" />
                  Confidence Range
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>{filters.confidenceRange[0]}%</span>
                    <span>{filters.confidenceRange[1]}%</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={filters.confidenceRange[0]}
                      onChange={(e) => handleConfidenceRangeChange([parseInt(e.target.value), filters.confidenceRange[1]])}
                      className="slider-primary w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={filters.confidenceRange[1]}
                      onChange={(e) => handleConfidenceRangeChange([filters.confidenceRange[0], parseInt(e.target.value)])}
                      className="slider-primary w-full absolute top-0"
                    />
                  </div>
                </div>
              </div>

              {/* Empathy Range */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-medium text-neutral-700">
                  <Gauge className="h-4 w-4 mr-2 text-neutral-500" />
                  Empathy Range
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>{filters.empathyRange[0]}</span>
                    <span>{filters.empathyRange[1]}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={filters.empathyRange[0]}
                      onChange={(e) => handleEmpathyRangeChange([parseInt(e.target.value), filters.empathyRange[1]])}
                      className="slider-primary w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={filters.empathyRange[1]}
                      onChange={(e) => handleEmpathyRangeChange([filters.empathyRange[0], parseInt(e.target.value)])}
                      className="slider-primary w-full absolute top-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex justify-end mt-6 pt-4 border-t border-neutral-100">
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50 rounded-lg transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
            <span className="text-sm font-medium text-neutral-700">Active filters:</span>

            {filters.query && (
              <span className="flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                Search: "{filters.query}"
                <button
                  onClick={() => handleQueryChange('')}
                  className="ml-2 hover:text-primary-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.classification !== 'all' && (
              <span className="flex items-center bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm">
                {classificationOptions.find(opt => opt.value === filters.classification)?.label}
                <button
                  onClick={() => handleClassificationChange('all')}
                  className="ml-2 hover:text-secondary-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {filters.languages.length > 0 && (
              <span className="flex items-center bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm">
                {filters.languages.length} language{filters.languages.length > 1 ? 's' : ''}
                <button
                  onClick={() => onFiltersChange({ ...filters, languages: [] })}
                  className="ml-2 hover:text-success-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;