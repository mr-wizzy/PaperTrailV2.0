import type { FC } from 'react';
import type { ProjectStatus } from '../../types/project';

export interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Recruiting: 'bg-blue-50 text-blue-700 border-blue-200',
  Completed: 'bg-slate-50 text-slate-700 border-slate-200',
  Suspended: 'bg-amber-50 text-amber-700 border-amber-200',
};

const STATUS_DOT_COLORS: Record<ProjectStatus, string> = {
  Active: 'bg-emerald-500',
  Recruiting: 'bg-blue-500',
  Completed: 'bg-slate-400',
  Suspended: 'bg-amber-500',
};

export const StatusBadge: FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const badgeClasses = STATUS_STYLES[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  const dotColor = STATUS_DOT_COLORS[status] || 'bg-gray-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};
