import React from 'react';
import {
  Download,
  Trash2,
  GitCompare,
  Archive,
  Share,
  Tag,
  X,
  CheckCircle
} from 'lucide-react';

interface BulkOperationsToolbarProps {
  selectedItems: string[];
  onBulkExport: () => void;
  onBulkDelete: () => void;
  onBulkCompare: () => void;
  onBulkArchive?: () => void;
  onBulkTag?: () => void;
  onBulkShare?: () => void;
  onClearSelection: () => void;
  className?: string;
}

const BulkOperationsToolbar: React.FC<BulkOperationsToolbarProps> = ({
  selectedItems,
  onBulkExport,
  onBulkDelete,
  onBulkCompare,
  onBulkArchive,
  onBulkTag,
  onBulkShare,
  onClearSelection,
  className = ''
}) => {
  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className={`bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-800">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
          </div>

          {selectedItems.length > 1 && (
            <div className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
              Bulk operations available
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Export */}
          <button
            onClick={onBulkExport}
            className="btn-secondary-enterprise text-sm"
            title="Export selected analyses"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          {/* Compare (only show if 2+ items selected) */}
          {selectedItems.length >= 2 && (
            <button
              onClick={onBulkCompare}
              className="btn-secondary-enterprise text-sm"
              title="Compare selected analyses"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare
            </button>
          )}

          {/* Archive */}
          {onBulkArchive && (
            <button
              onClick={onBulkArchive}
              className="btn-secondary-enterprise text-sm"
              title="Archive selected analyses"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </button>
          )}

          {/* Tag */}
          {onBulkTag && (
            <button
              onClick={onBulkTag}
              className="btn-secondary-enterprise text-sm"
              title="Add tags to selected analyses"
            >
              <Tag className="w-4 h-4 mr-2" />
              Tag
            </button>
          )}

          {/* Share */}
          {onBulkShare && (
            <button
              onClick={onBulkShare}
              className="btn-secondary-enterprise text-sm"
              title="Share selected analyses"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </button>
          )}

          {/* Delete */}
          <button
            onClick={onBulkDelete}
            className="inline-flex items-center px-4 py-2 border-2 border-error-200 text-sm font-medium rounded-lg text-error-700 bg-error-50 hover:bg-error-100 hover:border-error-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error-500 transition-all duration-200"
            title="Delete selected analyses"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Indicator for Bulk Operations */}
      {selectedItems.length > 10 && (
        <div className="mt-3 pt-3 border-t border-primary-200">
          <div className="flex items-center justify-between text-xs text-primary-700">
            <span>Large selection detected</span>
            <span>Operations may take longer to complete</span>
          </div>
        </div>
      )}

      {/* Quick Actions Info */}
      <div className="mt-3 pt-3 border-t border-primary-200">
        <div className="flex items-center justify-between">
          <div className="text-xs text-primary-700">
            <strong>Quick tips:</strong> Use Ctrl+Click to select individual items, Shift+Click for range selection
          </div>
          <div className="flex items-center space-x-4 text-xs text-primary-600">
            {selectedItems.length >= 2 && (
              <span className="flex items-center">
                <GitCompare className="w-3 h-3 mr-1" />
                Comparison available
              </span>
            )}
            <span className="flex items-center">
              <Download className="w-3 h-3 mr-1" />
              Export ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsToolbar;