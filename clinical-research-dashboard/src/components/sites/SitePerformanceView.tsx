import type { FC } from 'react';
import { Users, Building2, TrendingDown, ShieldAlert, FileText, ArrowLeft } from 'lucide-react';
import type { ClinicalProject } from '../../types/project';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { SitePerformanceTable } from './SitePerformanceTable';
import { EmptyState } from '../common/EmptyState';

export interface SitePerformanceViewProps {
  project: ClinicalProject | null | undefined;
  onNavigateHome: () => void;
  onNavigateToStudies: () => void;
  onNavigateToStudyOverview: (studyId: string) => void;
  onNavigateToReport: (studyId: string) => void;
}

export const SitePerformanceView: FC<SitePerformanceViewProps> = ({
  project,
  onNavigateHome,
  onNavigateToStudies,
  onNavigateToStudyOverview,
  onNavigateToReport,
}) => {
  if (!project) {
    return (
      <EmptyState
        type="not-found"
        onBackToDashboard={onNavigateHome}
      />
    );
  }

  const sites = project.sites || [];
  const currentEnrollment = project.enrollment?.current || 450;
  const targetEnrollment = project.enrollment?.target || 1500;
  const enrollmentRate = Math.round((currentEnrollment / targetEnrollment) * 100);

  const sitesAtRisk = project.metrics?.sitesAtRisk || 4;
  const totalSitesCount = project.metrics?.sitesCount || sites.length || 20;
  const dropRate = project.metrics?.dropRate || 17;
  const complianceScore = project.metrics?.complianceScore || 3;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onNavigateHome },
          { label: 'Studies', onClick: onNavigateToStudies },
          { label: project.id, onClick: () => onNavigateToStudyOverview(project.id) },
          { label: 'Site Performance Details', active: true },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Site Performance
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {project.id} | {project.title} | {totalSitesCount} active sites
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToStudyOverview(project.id)}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <span>Study overview</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToReport(project.id)}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate report</span>
          </button>
        </div>
      </div>

      {/* 4 Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Enrolled */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Total Enrolled</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {currentEnrollment.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Of {targetEnrollment.toLocaleString()} Site Target ({enrollmentRate}%)
          </div>
        </div>

        {/* 2. Sites at risk */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Sites at risk</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {sitesAtRisk} / {totalSitesCount}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-0.5">
            Critical Risk Level
          </div>
        </div>

        {/* 3. Drop Rate */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Drop Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
            {dropRate}%
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Subject Withdrawal Rate
          </div>
        </div>

        {/* 4. Average Compliance */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Average Compliance</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {complianceScore}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Protocol Adherence Score
          </div>
        </div>
      </div>

      {/* 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Enrollment By Site list */}
        <div className="lg:col-span-1 card-panel bg-white p-5 sm:p-6 border border-gray-200/80 rounded-xl shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Enrollment by site</h2>
            <p className="text-xs text-gray-500 mt-0.5">Enrolled vs target per site</p>
          </div>

          <div className="space-y-4 pt-1">
            {sites.map((site) => {
              const siteRate = site.target > 0 ? Math.round((site.enrolled / site.target) * 100) : 0;

              return (
                <div key={site.id} className="space-y-1">
                  <div className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                    {site.name}
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(siteRate > 0 ? 3 : 0, siteRate))}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {site.enrolled} / {site.target} patients
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Site Performance Table */}
        <div className="lg:col-span-2">
          <SitePerformanceTable sites={sites} />
        </div>
      </div>
    </div>
  );
};
