import type { FC } from 'react';
import type { ClinicalProject } from '../../types/project';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';

export interface StudiesTableProps {
  projects: ClinicalProject[];
  onSelectStudy: (id: string) => void;
  className?: string;
}

export const StudiesTable: FC<StudiesTableProps> = ({
  projects,
  onSelectStudy,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200/80 bg-gray-50/60">
            <th scope="col" className="py-3.5 pl-6 pr-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              STUDY
            </th>
            <th scope="col" className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              STATUS
            </th>
            <th scope="col" className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 min-w-[190px]">
              ENROLMENT
            </th>
            <th scope="col" className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              RISK LEVEL
            </th>
            <th scope="col" className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">
              SITES
            </th>
            <th scope="col" className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              PHASE
            </th>
            <th scope="col" className="py-3.5 pl-4 pr-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              RESEARCH MANAGER
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {projects.map((project) => {
            const current = project.enrollment?.current || 0;
            const target = project.enrollment?.target || 0;
            const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
            const sitesCount = project.metrics?.sitesCount || project.sites?.length || 1;

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
                className="group hover:bg-blue-50/40 transition-colors cursor-pointer"
              >
                {/* Study Title / ID */}
                <td className="py-4 pl-6 pr-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.id}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-xs">
                      {project.title}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge status={project.status} />
                </td>

                {/* Enrollment Progress Bar */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-9 text-right shrink-0">
                      {percentage}%
                    </span>
                  </div>
                </td>

                {/* Risk Level */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <RiskBadge risk={project.riskLevel} />
                </td>

                {/* Sites Count */}
                <td className="py-4 px-4 whitespace-nowrap text-center text-xs font-semibold text-gray-800">
                  {sitesCount}
                </td>

                {/* Phase */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="text-xs font-medium text-gray-600">
                    {project.phase}
                  </span>
                </td>

                {/* Research Manager */}
                <td className="py-4 pl-4 pr-6 whitespace-nowrap">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-tight">
                    {project.researchManager || project.principalInvestigator || 'N/A'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
