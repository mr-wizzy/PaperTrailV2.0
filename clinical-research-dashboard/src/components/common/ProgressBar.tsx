import type { FC } from 'react';

export interface ProgressBarProps {
  current: number;
  target: number;
  showLabels?: boolean;
  className?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  current,
  target,
  showLabels = true,
  className = '',
}) => {
  const safeCurrent = Math.max(0, current || 0);
  const safeTarget = Math.max(0, target || 0);
  const percentage = safeTarget > 0 ? Math.round((safeCurrent / safeTarget) * 100) : 0;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5 font-medium">
          <span>
            <strong className="text-gray-900 font-semibold">{safeCurrent.toLocaleString()}</strong>
            <span className="text-gray-400"> / </span>
            {safeTarget.toLocaleString()}
          </span>
          <span className="text-gray-500 font-medium">{clampedPercentage}%</span>
        </div>
      )}

      <div
        className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={0}
        aria-valuemax={safeTarget}
        aria-label={`Enrollment progress: ${clampedPercentage}%`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            clampedPercentage >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
          }`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};
