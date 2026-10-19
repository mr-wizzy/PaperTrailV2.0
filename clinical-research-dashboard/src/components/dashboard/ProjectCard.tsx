import type { FC } from 'react';
import type { ClinicalProject } from '../../types/project';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { ChevronRight, User } from 'lucide-react';

export interface ProjectCardProps {
  project: ClinicalProject;
  onSelectProject: (id: string) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  return (
    <div
      onClick={() => onSelectProject(project.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectProject(project.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title || project.id}`}
      className="card-panel bg-white p-4 border border-gray-200/90 rounded-xl shadow-xs hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {/* Top Header: Protocol, Status, Chevron */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold font-mono text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded">
          {project.protocolNumber || 'N/A'}
        </span>
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
        {project.title || 'Untitled Project'}
      </h3>

      {/* Phase & Area Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {project.phase || 'N/A'}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {project.therapeuticArea || 'N/A'}
        </span>
      </div>

      {/* Enrollment */}
      <div className="mb-3 pt-2 border-t border-gray-100">
        <ProgressBar
          current={project.enrollment?.current || 0}
          target={project.enrollment?.target || 0}
        />
      </div>

      {/* Principal Investigator */}
      <div className="flex items-center gap-1.5 text-xs text-gray-600">
        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
        <span className="truncate">PI: {project.principalInvestigator || 'N/A'}</span>
      </div>
    </div>
  );
};
