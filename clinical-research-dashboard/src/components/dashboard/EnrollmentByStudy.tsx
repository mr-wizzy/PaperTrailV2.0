import type { FC } from 'react';
import type { ClinicalProject } from '../../types/project';

export interface EnrollmentByStudyProps {
  projects: ClinicalProject[];
  onSelectStudy: (id: string) => void;
  onSeeAll: () => void;
  className?: string;
}

export const EnrollmentByStudy: FC<EnrollmentByStudyProps> = ({
  projects,
  onSelectStudy,
  onSeeAll,
  className = '',
}) => {
  // Take top 4 flagship studies for the executive widget
  const displayedProjects = projects.slice(0, 4);

  return (
    <div className={`card-panel bg-white p-5 sm:p-6 border border-gray-200/80 rounded-xl shadow-xs flex flex-col justify-between ${className}`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-gray-900">Enrollment by study</h2>
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            See all
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-5">Percentage of target reached</p>

        {/* Study Progress List */}
        <div className="space-y-4">
          {displayedProjects.map((project) => {
            const current = project.enrollment?.current || 0;
            const target = project.enrollment?.target || 0;
            const percentage = target > 0 ? Math.round((current / target) * 100) : 0;

            // Color tokens matching the UI mockup
            let barColor = 'bg-emerald-500';
            let textColor = 'text-emerald-600';
            if (percentage < 15) {
              barColor = 'bg-rose-400';
              textColor = 'text-rose-500';
            } else if (percentage < 50) {
              barColor = 'bg-amber-500';
              textColor = 'text-amber-600';
            }

            return (
              <div
                key={project.id}
                onClick={() => onSelectStudy(project.id)}
                className="group cursor-pointer p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStudy(project.id);
                  }
                }}
              >
                {/* Top Row: Name and Percentage */}
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                    {project.id}
                  </span>
                  <span className={textColor}>{percentage}%</span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
                  />
                </div>

                {/* Patients Count Subtext */}
                <div className="mt-1 text-[11px] text-gray-500 font-medium">
                  {current.toLocaleString()} / {target.toLocaleString()} patients
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
