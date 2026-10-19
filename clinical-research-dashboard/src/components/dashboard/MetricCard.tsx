import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  id?: string;
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
}

export const MetricCard: FC<MetricCardProps> = ({
  id,
  label,
  value,
  subtext,
  icon: Icon,
  iconColorClass = 'text-blue-600',
  iconBgClass = 'bg-blue-50',
}) => {
  return (
    <div
      id={id}
      className="card-panel p-5 sm:p-6 bg-white border border-gray-200/80 rounded-xl shadow-xs transition-shadow hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBgClass} ${iconColorClass}`}
          aria-hidden="true"
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="mt-1 text-xs text-gray-500 truncate">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
