import type { FC } from 'react';
import type { TrialSite } from '../../types/project';

export interface SitePreviewListProps {
  sites: TrialSite[];
  onSeeAll: () => void;
  className?: string;
}

export const SitePreviewList: FC<SitePreviewListProps> = ({
  sites,
  onSeeAll,
  className = '',
}) => {
  const displayedSites = sites.slice(0, 4);

  return (
    <div className={`card-panel bg-white p-5 sm:p-6 border border-gray-200/80 rounded-xl shadow-xs flex flex-col justify-between ${className}`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Site Performance</h2>
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            See all
          </button>
        </div>

        {/* Site List */}
        <div className="space-y-4">
          {displayedSites.map((site) => {
            const percentage = site.target > 0 ? Math.round((site.enrolled / site.target) * 100) : 0;

            let barColor = 'bg-emerald-500';
            let textColor = 'text-emerald-600';
            if (percentage < 25) {
              barColor = 'bg-rose-400';
              textColor = 'text-rose-500';
            } else if (percentage < 50) {
              barColor = 'bg-amber-500';
              textColor = 'text-amber-600';
            }

            return (
              <div key={site.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-800 uppercase tracking-tight">{site.name}</span>
                  <span className={textColor}>{percentage}%</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
                  />
                </div>

                <div className="text-[11px] text-gray-400 font-medium">
                  {site.enrolled} / {site.target} patients
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
