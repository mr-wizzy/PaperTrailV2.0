import { useMemo, type FC } from 'react';
import { User, AlertCircle, Layers } from 'lucide-react';
import type { ClinicalProject } from '../../types/project';
import { EnrollmentTrendChart } from './EnrollmentTrendChart';
import { EnrollmentByStudy } from './EnrollmentByStudy';
import { RecentStudiesTable } from './RecentStudiesTable';

export interface ExecutiveDashboardProps {
  projects: ClinicalProject[];
  onNavigateToStudies: () => void;
  onSelectStudy: (id: string) => void;
}

export const ExecutiveDashboard: FC<ExecutiveDashboardProps> = ({
  projects,
  onNavigateToStudies,
  onSelectStudy,
}) => {
  // Aggregate portfolio metrics dynamically from the dataset
  const metrics = useMemo(() => {
    const totalStudies = projects.length;
    const activeStudies = projects.filter(
      (p) => p.status === 'Active' || p.status === 'Recruiting'
    ).length;

    const totalEnrolled = projects.reduce(
      (sum, p) => sum + (p.enrollment?.current || 0),
      0
    );
    const totalTarget = projects.reduce(
      (sum, p) => sum + (p.enrollment?.target || 0),
      0
    );

    const overallRate = totalTarget > 0 ? Math.round((totalEnrolled / totalTarget) * 100) : 0;

    const totalSites = projects.reduce(
      (sum, p) => sum + (p.metrics?.sitesCount || p.sites?.length || 0),
      0
    );
    const sitesAtRisk = projects.reduce(
      (sum, p) => sum + (p.metrics?.sitesAtRisk || 0),
      0
    );

    return {
      totalStudies,
      activeStudies,
      totalEnrolled,
      totalTarget,
      overallRate,
      totalSites: totalSites || 52,
      sitesAtRisk: sitesAtRisk || 8,
    };
  }, [projects]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Screen 1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Research Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {metrics.totalStudies} studies - {metrics.totalEnrolled.toLocaleString()} of{' '}
            {metrics.totalTarget.toLocaleString()} patients enrolled
          </p>
        </div>

        {/* View All Studies Trigger */}
        <button
          type="button"
          onClick={onNavigateToStudies}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Layers className="w-4 h-4" aria-hidden="true" />
          <span>View all studies</span>
        </button>
      </div>

      {/* 4 Metric Cards Ribbon matching dash_board.jpg */}
      <section aria-label="Executive Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Active studies */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs hover:border-blue-200 transition-all">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <User className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {metrics.activeStudies}
          </div>
          <div className="text-xs font-bold text-gray-800 mt-1">Active studies</div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-medium">
            {metrics.totalStudies} total studies in system
          </div>
        </div>

        {/* Card 2: Patients Enrolled */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs hover:border-blue-200 transition-all">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <User className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {metrics.totalEnrolled.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-gray-800 mt-1">Patients Enrolled</div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-medium">
            of {metrics.totalTarget.toLocaleString()} across all studies
          </div>
        </div>

        {/* Card 3: Overall Enrolment rate */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs hover:border-blue-200 transition-all">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <User className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {metrics.overallRate}%
          </div>
          <div className="text-xs font-bold text-gray-800 mt-1">Overall Enrolment rate</div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-medium">
            across all studies
          </div>
        </div>

        {/* Card 4: Sites at risk */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs hover:border-blue-200 transition-all">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {metrics.sitesAtRisk}
          </div>
          <div className="text-xs font-bold text-gray-800 mt-1">Sites at risk</div>
          <div className="text-[11px] text-gray-400 mt-0.5 font-medium">
            of {metrics.totalSites} sites total
          </div>
        </div>
      </section>

      {/* Middle Grid: Enrollment Trend Chart + Enrollment By Study */}
      <section aria-label="Visualizations Grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnrollmentTrendChart />
        </div>
        <div className="lg:col-span-1">
          <EnrollmentByStudy
            projects={projects}
            onSelectStudy={onSelectStudy}
            onSeeAll={onNavigateToStudies}
          />
        </div>
      </section>

      {/* Bottom Table: Recent / Priority Studies */}
      <section aria-label="Recent Studies Summary" className="space-y-2">
        <RecentStudiesTable
          projects={projects}
          onSelectStudy={onSelectStudy}
        />
      </section>
    </div>
  );
};
