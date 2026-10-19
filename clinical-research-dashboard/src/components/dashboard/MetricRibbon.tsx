import { useMemo, type FC } from 'react';
import { FlaskConical, Activity, Users, CheckCircle2 } from 'lucide-react';
import type { ClinicalProject } from '../../types/project';
import { MetricCard } from './MetricCard';

export interface MetricRibbonProps {
  projects: ClinicalProject[];
}

export const MetricRibbon: FC<MetricRibbonProps> = ({ projects }) => {
  const metrics = useMemo(() => {
    const totalCount = projects.length;
    const activeCount = projects.filter(
      (p) => p.status === 'Active' || p.status === 'Recruiting'
    ).length;
    const totalEnrollment = projects.reduce(
      (sum, p) => sum + (p.enrollment?.current || 0),
      0
    );
    const completedCount = projects.filter((p) => p.status === 'Completed').length;
    const completionRate =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return {
      totalCount,
      activeCount,
      totalEnrollment,
      completionRate,
    };
  }, [projects]);

  return (
    <section aria-label="Study Metrics" className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          id="metric-total-studies"
          label="Total Studies"
          value={metrics.totalCount}
          subtext="Total protocols in registry"
          icon={FlaskConical}
          iconColorClass="text-blue-600"
          iconBgClass="bg-blue-50"
        />
        <MetricCard
          id="metric-active-studies"
          label="Active Studies"
          value={metrics.activeCount}
          subtext="Active or recruiting"
          icon={Activity}
          iconColorClass="text-emerald-600"
          iconBgClass="bg-emerald-50"
        />
        <MetricCard
          id="metric-total-enrollment"
          label="Total Enrollment"
          value={metrics.totalEnrollment.toLocaleString()}
          subtext="Patients enrolled to date"
          icon={Users}
          iconColorClass="text-indigo-600"
          iconBgClass="bg-indigo-50"
        />
        <MetricCard
          id="metric-completion-rate"
          label="Completion Rate"
          value={`${metrics.completionRate}%`}
          subtext="Completed trial protocols"
          icon={CheckCircle2}
          iconColorClass="text-teal-600"
          iconBgClass="bg-teal-50"
        />
      </div>
    </section>
  );
};
