import type { FC } from 'react';
import type { ClinicalProject } from '../../types/project';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { ChevronRight, Building2, User } from 'lucide-react';

export interface StudyCardProps {
  project: ClinicalProject;
  onSelectStudy: (id: string) => void;
}

export const StudyCard: FC<StudyCardProps> = ({ project, onSelectStudy }) => {
  const current = project.enrollment?.current || 0;
  const target = project.enrollment?.target || 0;
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
  const sitesCount = project.metrics?.sitesCount || project.sites?.length || 1;

  let barColor = 'bg-emerald-500';
  if (percentage < 15) barColor = 'bg-rose-400';
  else if (percentage < 50) barColor = 'bg-amber-500';

  return (
    <div
      onClick={() => onSelectStudy(project.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectStudy(project.id);
        }
      }}
      className="card-panel bg-white p-4 border border-gray-200/80 rounded-xl shadow-xs hover:border-blue-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-bold text-gray-900">{project.id}</span>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={project.status} />
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xs font-medium text-gray-600 mb-3 line-clamp-2">
        {project.title}
      </h3>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
          <span>Enrolment</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Badges & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-2">
          <RiskBadge risk={project.riskLevel} />
          <span className="text-gray-500">{project.phase}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 font-medium">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          <span>{sitesCount} sites</span>
        </div>
      </div>

      {/* Research Manager */}
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
        <User className="w-3 h-3 text-gray-400" />
        <span className="truncate">Manager: {project.researchManager || project.principalInvestigator || 'N/A'}</span>
      </div>
    </div>
  );
};
