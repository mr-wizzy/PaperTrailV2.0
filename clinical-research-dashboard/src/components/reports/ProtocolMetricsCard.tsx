import type { FC } from 'react';
import { Activity } from 'lucide-react';
import type { ClinicalProject } from '../../types/project';

export interface ProtocolMetricsCardProps {
  project: ClinicalProject;
  className?: string;
}

export const ProtocolMetricsCard: FC<ProtocolMetricsCardProps> = ({
  project,
  className = '',
}) => {
  const reg = project.regulatory;
  const metrics = project.metrics;

  const rows = [
    { label: 'Protocol Version', value: reg?.protocolVersion || 'v2.1 (Apr 2024)' },
    { label: 'IRB Status', value: reg?.irbStatus || 'Approved', isApproved: true },
    { label: 'FDA IND Number', value: reg?.fdaIndNumber || 'IND-142857', isMono: true },
    { label: 'Primary PI', value: project.principalInvestigator || 'Dr. Amelia Chen' },
    { label: 'Sites Active', value: metrics?.activeSites || 6 },
    { label: 'Avg. Compliance', value: `${metrics?.complianceScore ? metrics.complianceScore * 20 : 85}%` },
    { label: 'Reporting Period End', value: reg?.reportingPeriodEnd || 'Apr 30, 2024' },
  ];

  return (
    <div className={`card-panel bg-white p-6 border border-gray-200/80 rounded-xl shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <Activity className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-gray-900">Protocol & Study Metrics</h3>
      </div>

      {/* Rows */}
      <div className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-xs gap-2">
            <span className="text-gray-500 font-medium">{row.label}</span>
            <span
              className={`font-semibold text-right ${
                row.isApproved
                  ? 'text-emerald-700'
                  : row.isMono
                  ? 'font-mono text-gray-800'
                  : 'text-gray-900'
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
