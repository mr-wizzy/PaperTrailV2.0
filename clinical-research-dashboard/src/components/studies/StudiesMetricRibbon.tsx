import { useMemo, type FC } from 'react';
import { Check, AlertTriangle, AlertCircle, Percent } from 'lucide-react';
import type { ClinicalProject } from '../../types/project';

export interface StudiesMetricRibbonProps {
  projects: ClinicalProject[];
}

export const StudiesMetricRibbon: FC<StudiesMetricRibbonProps> = ({ projects }) => {
  const stats = useMemo(() => {
    const activeCount = projects.filter((p) => p.status === 'Active').length;
    const delayedCount = projects.filter((p) => (p.timeline?.patientsBehindTarget || 0) > 0 || p.status === 'Suspended').length;
    const criticalRiskCount = projects.filter((p) => p.riskLevel === 'Critical').length;

    const totalRates = projects.map((p) => {
      const cur = p.enrollment?.current || 0;
      const tar = p.enrollment?.target || 1;
      return (cur / tar) * 100;
    });
    const avgRate =
      totalRates.length > 0
        ? Math.round(totalRates.reduce((a, b) => a + b, 0) / totalRates.length)
        : 0;

    return {
      active: activeCount,
      delayed: delayedCount,
      critical: criticalRiskCount,
      avgRate,
    };
  }, [projects]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active */}
      <div className="card-panel bg-white p-4 sm:p-5 border border-gray-200/80 rounded-xl shadow-xs flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">{stats.active}</div>
          <div className="text-xs font-semibold text-gray-500">Active</div>
        </div>
      </div>

      {/* 2. Delayed */}
      <div className="card-panel bg-white p-4 sm:p-5 border border-gray-200/80 rounded-xl shadow-xs flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">{stats.delayed}</div>
          <div className="text-xs font-semibold text-gray-500">Delayed</div>
        </div>
      </div>

      {/* 3. Critical Risk */}
      <div className="card-panel bg-white p-4 sm:p-5 border border-gray-200/80 rounded-xl shadow-xs flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">{stats.critical}</div>
          <div className="text-xs font-semibold text-gray-500">Critical Risk</div>
        </div>
      </div>

      {/* 4. Average Enrollment Rate */}
      <div className="card-panel bg-white p-4 sm:p-5 border border-gray-200/80 rounded-xl shadow-xs flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Percent className="w-5 h-5 stroke-[2]" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">{stats.avgRate}%</div>
          <div className="text-xs font-semibold text-gray-500">Average enrollment rate</div>
        </div>
      </div>
    </div>
  );
};
