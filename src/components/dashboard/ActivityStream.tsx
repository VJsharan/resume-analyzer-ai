import React from 'react';
import { formatDistance } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
  Download,
  Users,
  Activity,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'analysis_complete' | 'analysis_failed' | 'bulk_export' | 'system_alert' | 'upload_success' | 'processing_start';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'error' | 'warning' | 'info' | 'processing';
  actionUrl?: string;
  metadata?: {
    filename?: string;
    duration?: number;
    language?: string;
    empathy_score?: number;
    classification?: string;
    user?: string;
    count?: number;
  };
}

interface ActivityStreamProps {
  activities: ActivityItem[];
  loading?: boolean;
  onRefresh?: () => void;
  onItemClick?: (item: ActivityItem) => void;
  className?: string;
}

// Activity Type Configuration
const getActivityConfig = (type: string) => {
  switch (type) {
    case 'analysis_complete':
      return {
        icon: CheckCircle,
        colorClass: 'text-success-600 bg-success-100',
        borderClass: 'border-success-200'
      };
    case 'analysis_failed':
      return {
        icon: XCircle,
        colorClass: 'text-error-600 bg-error-100',
        borderClass: 'border-error-200'
      };
    case 'bulk_export':
      return {
        icon: Download,
        colorClass: 'text-primary-600 bg-primary-100',
        borderClass: 'border-primary-200'
      };
    case 'system_alert':
      return {
        icon: AlertTriangle,
        colorClass: 'text-warning-600 bg-warning-100',
        borderClass: 'border-warning-200'
      };
    case 'upload_success':
      return {
        icon: Upload,
        colorClass: 'text-secondary-600 bg-secondary-100',
        borderClass: 'border-secondary-200'
      };
    case 'processing_start':
      return {
        icon: RefreshCw,
        colorClass: 'text-neutral-600 bg-neutral-100',
        borderClass: 'border-neutral-200'
      };
    default:
      return {
        icon: Activity,
        colorClass: 'text-neutral-600 bg-neutral-100',
        borderClass: 'border-neutral-200'
      };
  }
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          color: 'bg-success-100 text-success-800 border-success-200',
          label: 'Success'
        };
      case 'error':
        return {
          color: 'bg-error-100 text-error-800 border-error-200',
          label: 'Error'
        };
      case 'warning':
        return {
          color: 'bg-warning-100 text-warning-800 border-warning-200',
          label: 'Warning'
        };
      case 'processing':
        return {
          color: 'bg-primary-100 text-primary-800 border-primary-200',
          label: 'Processing'
        };
      default:
        return {
          color: 'bg-neutral-100 text-neutral-800 border-neutral-200',
          label: 'Info'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// Activity Metadata Display
const ActivityMetadata: React.FC<{ metadata?: ActivityItem['metadata'] }> = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <div className="mt-2 space-y-1">
      {metadata.filename && (
        <div className="flex items-center text-xs text-neutral-600">
          <FileText className="w-3 h-3 mr-1" />
          <span className="truncate max-w-40">{metadata.filename}</span>
        </div>
      )}

      {metadata.language && (
        <div className="flex items-center text-xs text-neutral-600">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-2" />
          <span className="capitalize">{metadata.language}</span>
        </div>
      )}

      {metadata.empathy_score !== undefined && (
        <div className="flex items-center text-xs text-neutral-600">
          <TrendingUp className="w-3 h-3 mr-1" />
          <span>Empathy: {metadata.empathy_score}/100</span>
        </div>
      )}

      {metadata.classification && (
        <div className="flex items-center text-xs text-neutral-600">
          <Users className="w-3 h-3 mr-1" />
          <span>{metadata.classification}</span>
        </div>
      )}

      {metadata.count !== undefined && (
        <div className="flex items-center text-xs text-neutral-600">
          <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2" />
          <span>{metadata.count} items</span>
        </div>
      )}
    </div>
  );
};

// Individual Activity Item Component
const ActivityStreamItem: React.FC<{
  activity: ActivityItem;
  onClick?: (item: ActivityItem) => void;
  isLast?: boolean;
}> = ({ activity, onClick, isLast = false }) => {
  const config = getActivityConfig(activity.type);
  const Icon = config.icon;

  const handleClick = () => {
    if (onClick) {
      onClick(activity);
    } else if (activity.actionUrl) {
      window.open(activity.actionUrl, '_blank');
    }
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-neutral-200" />
      )}

      {/* Activity Content */}
      <div
        className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-200 ${
          onClick || activity.actionUrl
            ? 'hover:bg-neutral-50 cursor-pointer'
            : ''
        }`}
        onClick={handleClick}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-full border ${config.colorClass} ${config.borderClass}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-neutral-900 truncate">
                {activity.title}
              </h4>
              <p className="text-sm text-neutral-600 mt-1">
                {activity.description}
              </p>
            </div>

            <div className="flex-shrink-0 ml-2">
              <StatusBadge status={activity.status} />
            </div>
          </div>

          {/* Metadata */}
          <ActivityMetadata metadata={activity.metadata} />

          {/* Timestamp */}
          <div className="flex items-center mt-2 text-xs text-neutral-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>
              {formatDistance(new Date(activity.timestamp), new Date(), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Activity Stream Component
const ActivityStream: React.FC<ActivityStreamProps> = ({
  activities,
  loading = false,
  onRefresh,
  onItemClick,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`card-enterprise ${className}`}>
        <div className="card-header">
          <h3 className="card-title">Recent Activity</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-neutral-400 animate-spin mx-auto mb-4" />
              <p className="text-sm text-neutral-600">Loading activities...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-enterprise ${className}`}>
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title">Recent Activity</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Latest system events and analysis updates
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Refresh activities"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="card-body p-0">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-sm font-medium text-neutral-900">No recent activity</h3>
            <p className="mt-2 text-sm text-neutral-600">
              System events and analysis updates will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {activities.map((activity, index) => (
              <ActivityStreamItem
                key={activity.id}
                activity={activity}
                onClick={onItemClick}
                isLast={index === activities.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {activities.length > 0 && (
        <div className="card-footer">
          <div className="text-center">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityStream;