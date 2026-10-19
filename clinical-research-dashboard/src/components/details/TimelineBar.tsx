import type { FC } from 'react';

export interface TimelineBarProps {
  elapsedPercent: number;
  timeRemaining: string;
  startDate: string;
  endDate: string;
  className?: string;
}

export const TimelineBar: FC<TimelineBarProps> = ({
  elapsedPercent,
  timeRemaining,
  startDate,
  endDate,
  className = '',
}) => {
  const clampedPercent = Math.min(100, Math.max(0, elapsedPercent));

  return (
    <div className={`card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs space-y-3 ${className}`}>
      {/* Top Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs font-bold">
        <span className="text-gray-800">Timeline</span>
        <div className="text-gray-600 font-semibold">
          <span className="text-blue-600">{clampedPercent}% elapsed</span>
          <span className="text-gray-300 mx-2">|</span>
          <span className="text-gray-700">{timeRemaining}</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-blue-50/80 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      {/* Dates row */}
      <div className="flex items-center justify-between text-xs font-medium text-gray-500">
        <span>Start: <strong className="text-gray-800 font-mono">{startDate}</strong></span>
        <span>End: <strong className="text-gray-800 font-mono">{endDate}</strong></span>
      </div>
    </div>
  );
};
