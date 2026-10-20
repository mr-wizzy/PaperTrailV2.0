import type { FC } from 'react';
import type { TrialSite } from '../../types/project';
import { RiskBadge } from '../common/RiskBadge';

export interface SitePerformanceTableProps {
  sites: TrialSite[];
  className?: string;
}

const SITE_STATUS_CLASSES: Record<string, string> = {
  Ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Planned: 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-slate-100 text-slate-700 border-slate-200',
};

const COMPLIANCE_TEXT_CLASSES: Record<string, string> = {
  High: 'text-emerald-700 font-bold',
  Medium: 'text-amber-700 font-semibold',
  Low: 'text-rose-700 font-bold',
};

export const SitePerformanceTable: FC<SitePerformanceTableProps> = ({
  sites,
  className = '',
}) => {
  return (
    <div className={`card-panel bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden ${className}`}>
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">Site Performance</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th scope="col" className="py-3.5 pl-4 sm:pl-6 pr-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                SITE
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                ENROLLED
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 min-w-[130px] sm:min-w-[160px]">
                DROP-OFF
              </th>
              <th scope="col" className="py-3.5 px-3 sm:px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                COMPLIANCE
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">
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
                  <td className="py-3.5 pl-4 sm:pl-6 pr-3 whitespace-nowrap">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">
                      {site.name}
                    </span>
                  </td>

                  {/* Enrolled Status Pill */}
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-2xs font-bold uppercase tracking-wider border ${statusClass}`}
                    >
                      {site.status}
                    </span>
                  </td>

                  {/* Drop-Off Rate Bar */}
                  <td className="py-3.5 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dropColor}`}
                          style={{ width: `${Math.min(100, Math.max(site.dropOffRate > 0 ? 3 : 0, site.dropOffRate))}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8 text-right shrink-0">
                        {site.dropOffRate}%
                      </span>
                    </div>
                  </td>

                  {/* Compliance */}
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                    <span className={`text-xs uppercase tracking-wider ${complianceClass}`}>
                      {site.compliance}
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="py-3.5 pl-3 pr-4 sm:pr-6 text-right whitespace-nowrap">
                    <RiskBadge risk={site.riskLevel} variant="text" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
