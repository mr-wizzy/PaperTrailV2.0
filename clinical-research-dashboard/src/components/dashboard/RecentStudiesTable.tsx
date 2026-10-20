import type { FC } from 'react';
import type { ClinicalProject } from '../../types/project';
import { RiskBadge } from '../common/RiskBadge';

export interface RecentStudiesTableProps {
  projects: ClinicalProject[];
  onSelectStudy: (id: string) => void;
  className?: string;
}

export const RecentStudiesTable: FC<RecentStudiesTableProps> = ({
  projects,
  onSelectStudy,
  className = '',
}) => {
  // Show top priority studies in the summary table
  const displayedProjects = projects.slice(0, 5);

  return (
    <div className={`card-panel bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden ${className}`}>
      {/* Desktop Table View */}
      <div className="overflow-x-auto">
        <table className="hidden md:table w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th scope="col" className="py-3.5 pl-4 sm:pl-6 pr-3 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                STUDY
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                STATUS
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 text-[11px] font-bold uppercase tracking-wider text-blue-700 min-w-[150px] md:min-w-[190px]">
                ENROLMENT
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 text-[11px] font-bold uppercase tracking-wider text-blue-700">
                RISK LEVEL
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-[11px] font-bold uppercase tracking-wider text-blue-700 text-right">
                SITES AT RISK
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {displayedProjects.map((project) => {
              const current = project.enrollment?.current || 0;
              const target = project.enrollment?.target || 0;
              const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
              const sitesAtRisk = project.metrics?.sitesAtRisk || 0;

              // Color determination
              let barColor = 'bg-emerald-500';
              if (percentage < 15) barColor = 'bg-rose-400';
              else if (percentage < 50) barColor = 'bg-amber-500';

              return (
                <tr
                  key={project.id}
                  onClick={() => onSelectStudy(project.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStudy(project.id);
                    }
                  }}
                  className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  {/* Study & Phase */}
                  <td className="py-3.5 pl-4 sm:pl-6 pr-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.id}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                        {project.phase || 'PHASE I'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      {project.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Enrolment Bar */}
                  <td className="py-3.5 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-8 text-right shrink-0">
                        {percentage}%
                      </span>
                    </div>
                  </td>

                  {/* Risk Level */}
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                    <RiskBadge risk={project.riskLevel} variant="text" />
                  </td>

                  {/* Sites at Risk */}
                  <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide ${
                        sitesAtRisk > 2
                          ? 'text-rose-600'
                          : sitesAtRisk > 0
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {sitesAtRisk} {sitesAtRisk === 1 ? 'SITE' : 'SITES'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack */}
      <div className="block md:hidden divide-y divide-gray-100">
        {displayedProjects.map((project) => {
          const current = project.enrollment?.current || 0;
          const target = project.enrollment?.target || 0;
          const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
          const sitesAtRisk = project.metrics?.sitesAtRisk || 0;

          let barColor = 'bg-emerald-500';
          if (percentage < 15) barColor = 'bg-rose-400';
          else if (percentage < 50) barColor = 'bg-amber-500';

          return (
            <div
              key={project.id}
              onClick={() => onSelectStudy(project.id)}
              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-gray-900">{project.id}</span>
                <span className="text-xs font-bold text-gray-700 uppercase">{project.status}</span>
              </div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {project.phase}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-700">{percentage}%</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <RiskBadge risk={project.riskLevel} variant="text" />
                <span className={sitesAtRisk > 2 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                  {sitesAtRisk} SITES AT RISK
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
