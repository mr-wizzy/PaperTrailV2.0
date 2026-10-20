import type { FC } from 'react';
import type { TrialSite } from '../../types/project';
import { RiskBadge } from '../common/RiskBadge';

export interface SitePerformanceTableProps {
  sites: TrialSite[];
  className?: string;
}

const SITE_STATUS_CLASSES: Record<string, string> = {
  Ongoing: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Planned: 'bg-amber-50 text-amber-600 border-amber-100',
  Completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Pending: 'bg-slate-100 text-slate-600 border-slate-200',
};

const COMPLIANCE_TEXT_CLASSES: Record<string, string> = {
  High: 'text-emerald-600 font-semibold',
  Medium: 'text-amber-600 font-semibold',
  Low: 'text-rose-600 font-semibold',
};

export const SitePerformanceTable: FC<SitePerformanceTableProps> = ({
  sites,
  className = '',
}) => {
  return (
    <div className={`card-panel bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden ${className}`}>
      {/* Table Card Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Site Performance</h2>
        <span className="text-[11px] font-medium text-gray-400">{sites.length} Active Centers</span>
      </div>

      {/* Desktop & Tablet Table (>= 768px) */}
      <div className="overflow-x-auto">
        <table className="hidden md:table w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th scope="col" className="py-3 pl-4 sm:pl-6 pr-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                SITE
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                ENROLLED
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400 min-w-[120px] sm:min-w-[150px]">
                DROP-OFF
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                COMPLIANCE
              </th>
              <th scope="col" className="py-3 pl-3 pr-4 sm:pr-6 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-right">
                RISK
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sites.map((site) => {
              const statusClass = SITE_STATUS_CLASSES[site.status] || 'bg-gray-100 text-gray-700';
              const complianceClass = COMPLIANCE_TEXT_CLASSES[site.compliance] || 'text-gray-700';

              let dropColor = 'bg-emerald-500';
              if (site.dropOffRate > 40) dropColor = 'bg-amber-500';
              if (site.dropOffRate > 70) dropColor = 'bg-rose-500';

              return (
                <tr key={site.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Site Name */}
                  <td className="py-3 pl-4 sm:pl-6 pr-3 whitespace-nowrap">
                    <span className="text-[11px] sm:text-xs font-semibold text-gray-800 uppercase tracking-tight truncate block max-w-[180px] lg:max-w-xs">
                      {site.name}
                    </span>
                  </td>

                  {/* Enrolled Status Pill */}
                  <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${statusClass}`}
                    >
                      {site.status}
                    </span>
                  </td>

                  {/* Drop-Off Rate Bar */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dropColor}`}
                          style={{ width: `${Math.min(100, Math.max(site.dropOffRate > 0 ? 3 : 0, site.dropOffRate))}%` }}
                        />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 w-8 text-right shrink-0">
                        {site.dropOffRate}%
                      </span>
                    </div>
                  </td>

                  {/* Compliance */}
                  <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                    <span className={`text-[10px] sm:text-[11px] uppercase tracking-wider ${complianceClass}`}>
                      {site.compliance}
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="py-3 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap">
                    <RiskBadge risk={site.riskLevel} variant="text" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (< 768px) */}
      <div className="block md:hidden divide-y divide-gray-100">
        {sites.map((site) => {
          const statusClass = SITE_STATUS_CLASSES[site.status] || 'bg-gray-100 text-gray-700';
          const complianceClass = COMPLIANCE_TEXT_CLASSES[site.compliance] || 'text-gray-700';

          let dropColor = 'bg-emerald-500';
          if (site.dropOffRate > 40) dropColor = 'bg-amber-500';
          if (site.dropOffRate > 70) dropColor = 'bg-rose-500';

          return (
            <div key={site.id} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition-colors">
              {/* Header: Site Name + Status */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">
                  {site.name}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border shrink-0 ${statusClass}`}
                >
                  {site.status}
                </span>
              </div>

              {/* Drop-off & Enrollment Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Drop-Off Rate:</span>
                  <span className="font-semibold text-gray-700">{site.dropOffRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dropColor}`}
                    style={{ width: `${Math.min(100, Math.max(site.dropOffRate > 0 ? 3 : 0, site.dropOffRate))}%` }}
                  />
                </div>
              </div>

              {/* Bottom Metadata: Patients, Compliance, Risk */}
              <div className="flex items-center justify-between pt-1 text-[11px] border-t border-gray-50">
                <span className="text-gray-400 font-medium">
                  {site.enrolled} / {site.target} Patients
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-[10px] uppercase">Compliance:</span>
                    <span className={`text-[10px] uppercase font-semibold ${complianceClass}`}>
                      {site.compliance}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-[10px] uppercase">Risk:</span>
                    <RiskBadge risk={site.riskLevel} variant="text" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
