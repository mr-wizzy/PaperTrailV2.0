import type { FC } from 'react';
import type { ClinicalProject } from '../../types/project';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { ChevronRight } from 'lucide-react';

export interface ProjectTableProps {
  projects: ClinicalProject[];
  onSelectProject: (id: string) => void;
}

export const ProjectTable: FC<ProjectTableProps> = ({ projects, onSelectProject }) => {
  return (
    <div className="overflow-x-auto">
      <table className="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200/90 bg-gray-50/60">
            <th scope="col" className="py-3.5 pl-4 sm:pl-6 pr-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Protocol & Title
            </th>
            <th scope="col" className="py-3.5 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Phase
            </th>
            <th scope="col" className="py-3.5 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th scope="col" className="py-3.5 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Therapeutic Area
            </th>
            <th scope="col" className="py-3.5 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 min-w-[140px] md:min-w-[170px]">
              Enrollment
            </th>
            <th scope="col" className="py-3.5 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Principal Investigator
            </th>
            <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {projects.map((project) => {
            return (
              <tr
                key={project.id}
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
                className="group hover:bg-blue-50/40 transition-colors cursor-pointer focus:outline-none focus:bg-blue-50/60"
              >
                {/* Protocol & Title */}
                <td className="py-4 pl-4 sm:pl-6 pr-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-blue-600 font-mono tracking-tight mb-0.5">
                      {project.protocolNumber || 'N/A'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {project.title || 'Untitled Project'}
                    </span>
                  </div>
                </td>

                {/* Phase */}
                <td className="py-4 px-3 sm:px-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {project.phase || 'N/A'}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-3 sm:px-4 whitespace-nowrap">
                  <StatusBadge status={project.status} />
                </td>

                {/* Therapeutic Area */}
                <td className="py-4 px-3 sm:px-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {project.therapeuticArea || 'N/A'}
                  </span>
                </td>

                {/* Enrollment */}
                <td className="py-4 px-3 sm:px-4">
                  <ProgressBar
                    current={project.enrollment?.current || 0}
                    target={project.enrollment?.target || 0}
                  />
                </td>

                {/* Principal Investigator */}
                <td className="py-4 px-3 sm:px-4 whitespace-nowrap text-sm text-gray-700">
                  {project.principalInvestigator || 'N/A'}
                </td>

                {/* Arrow indicator */}
                <td className="py-4 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap">
                  <ChevronRight
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all inline-block"
                    aria-hidden="true"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
