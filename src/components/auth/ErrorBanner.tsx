import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
