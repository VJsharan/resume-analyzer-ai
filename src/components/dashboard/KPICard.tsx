import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface TrendData {
  direction: 'up' | 'down' | 'stable';
  value: number;
  context: string;
}

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: TrendData;
  confidence?: number;
  status?: 'excellent' | 'good' | 'moderate' | 'poor';
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const TrendIndicator: React.FC<{ trend: TrendData }> = ({ trend }) => {
  const getTrendColor = () => {
    switch (trend.direction) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-error-600';
      default:
        return 'text-neutral-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className={`flex items-center text-sm font-medium ${getTrendColor()}`}>
      <span className="mr-1">{getTrendIcon()}</span>
      <span>{Math.abs(trend.value)}%</span>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'excellent':
        return {
          color: 'bg-success-100 text-success-800 border-success-200',
          label: 'Excellent'
        };
      case 'good':
        return {
          color: 'bg-primary-100 text-primary-800 border-primary-200',
          label: 'Good'
        };
      case 'moderate':
        return {
          color: 'bg-warning-100 text-warning-800 border-warning-200',
          label: 'Moderate'
        };
      case 'poor':
        return {
          color: 'bg-error-100 text-error-800 border-error-200',
          label: 'Poor'
        };
      default:
        return {
          color: 'bg-neutral-100 text-neutral-800 border-neutral-200',
          label: 'N/A'
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

const ConfidenceBar: React.FC<{ value: number }> = ({ value }) => {
  const getConfidenceColor = () => {
    if (value >= 80) return 'bg-success-500';
    if (value >= 60) return 'bg-warning-500';
    return 'bg-error-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs text-neutral-600 mb-1">
        <span>Confidence</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getConfidenceColor()}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  confidence,
  status = 'good',
  icon: Icon,
  color = 'primary',
  className = ''
}) => {
  const getCardColorClasses = () => {
    switch (color) {
      case 'success':
        return 'border-success-200 bg-gradient-to-br from-white to-success-50';
      case 'warning':
        return 'border-warning-200 bg-gradient-to-br from-white to-warning-50';
      case 'error':
        return 'border-error-200 bg-gradient-to-br from-white to-error-50';
      default:
        return 'border-primary-200 bg-gradient-to-br from-white to-primary-50';
    }
  };

  const getIconColorClasses = () => {
    switch (color) {
      case 'success':
        return 'from-success-500 to-success-600';
      case 'warning':
        return 'from-warning-500 to-warning-600';
      case 'error':
        return 'from-error-500 to-error-600';
      default:
        return 'from-primary-500 to-secondary-500';
    }
  };

  return (
    <div className={`card-enterprise hover-lift ${getCardColorClasses()} ${className}`}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${getIconColorClasses()}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          {status && <StatusBadge status={status} />}
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-4">
        <div className="flex items-baseline mb-2">
          <span className="text-4xl font-bold text-neutral-900 font-mono">
            {value}
          </span>
          {unit && (
            <span className="text-lg font-medium text-neutral-600 ml-1">
              {unit}
            </span>
          )}
        </div>

        <div className="text-sm font-medium text-neutral-600 mb-2">
          {title}
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center justify-between">
            <TrendIndicator trend={trend} />
            <span className="text-xs text-neutral-500">
              {trend.context}
            </span>
          </div>
        )}
      </div>

      {/* Confidence Bar */}
      {confidence !== undefined && (
        <div className="mt-4">
          <ConfidenceBar value={confidence} />
        </div>
      )}
    </div>
  );
};

export default KPICard;