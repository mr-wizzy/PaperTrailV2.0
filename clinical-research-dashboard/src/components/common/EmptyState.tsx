import type { FC } from 'react';
import { SearchX, Database, AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

export type EmptyStateType = 'no-filter-results' | 'zero-global-data' | 'not-found';

export interface EmptyStateProps {
  type: EmptyStateType;
  onReset?: () => void;
  onBackToDashboard?: () => void;
  className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
  type,
  onReset,
  onBackToDashboard,
  className = '',
}) => {
  if (type === 'zero-global-data') {
    return (
      <div
        className={`card-panel bg-white p-12 text-center border border-gray-200/80 rounded-xl shadow-xs flex flex-col items-center justify-center ${className}`}
      >
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4" aria-hidden="true">
          <Database className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No research projects available
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          No data has been loaded into the system.
        </p>
      </div>
    );
  }

  if (type === 'not-found') {
    return (
      <div
        className={`card-panel bg-white p-12 text-center border border-gray-200/80 rounded-xl shadow-xs flex flex-col items-center justify-center ${className}`}
      >
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4" aria-hidden="true">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Study not found
        </h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          The requested clinical study protocol could not be located in the current registry.
        </p>
        {onBackToDashboard && (
          <button
            type="button"
            onClick={onBackToDashboard}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>
    );
  }

  // Default: 'no-filter-results'
  return (
    <div
      className={`card-panel bg-white p-12 text-center border border-gray-200/80 rounded-xl shadow-xs flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4" aria-hidden="true">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        No matching clinical studies
      </h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        Try adjusting your search terms or clearing your filters.
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300/80 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-gray-500" aria-hidden="true" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
