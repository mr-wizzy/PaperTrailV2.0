import type { FC } from 'react';
import { Users, TrendingDown, Building2, Clock, FileText, ArrowUpRight } from 'lucide-react';
import type { ClinicalProject } from '../../types/project';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { TimelineBar } from './TimelineBar';
import { SitePreviewList } from './SitePreviewList';
import { EnrollmentTrendChart } from '../dashboard/EnrollmentTrendChart';
import { EmptyState } from '../common/EmptyState';

export interface StudyOverviewProps {
  project: ClinicalProject | null | undefined;
  onNavigateHome: () => void;
  onNavigateToStudies: () => void;
  onNavigateToSites: (studyId: string) => void;
  onNavigateToReport: (studyId: string) => void;
}

export const StudyOverview: FC<StudyOverviewProps> = ({
  project,
  onNavigateHome,
  onNavigateToStudies,
  onNavigateToSites,
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

  const currentEnrollment = project.enrollment?.current || 0;
  const targetEnrollment = project.enrollment?.target || 1;
  const enrollmentRate = Math.round((currentEnrollment / targetEnrollment) * 100);

  const activeSites = project.metrics?.activeSites || project.sites?.filter((s) => s.status === 'Ongoing').length || 6;
  const sitesNeedAttention = project.metrics?.sitesNeedAttention || 2;
  const patientsBehindTarget = project.timeline?.patientsBehindTarget || 0;
  const daysRemaining = project.timeline?.daysRemaining || 88;
  const timeRemainingText = project.timeline?.timeRemaining || '3 months remaining';

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onNavigateHome },
          { label: 'Studies', onClick: onNavigateToStudies },
          { label: project.id, active: true },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
              {project.phase}
            </span>
            <RiskBadge risk={project.riskLevel} />
            <StatusBadge status={project.status} />
          </div>

          {/* Title & Protocol */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Protocol: <strong className="font-mono text-gray-800">{project.protocolNumber}</strong>
            <span className="mx-2 text-gray-300">|</span>
            Sponsor: <strong className="text-gray-800">{project.sponsor || 'Federal Government'}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToReport(project.id)}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-gray-500" />
            <span>Generate report</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToSites(project.id)}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>View site details</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Bar */}
      <TimelineBar
        elapsedPercent={project.timeline?.elapsedPercent || 27}
        timeRemaining={timeRemainingText}
        startDate={project.timeline?.startDate || project.startDate}
        endDate={project.timeline?.endDate || '2026-11-30'}
      />

      {/* 4 Diagnostic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Current Enrollment */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Current Enrollment</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {currentEnrollment.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Of {targetEnrollment.toLocaleString()} Site Target ({enrollmentRate}%)
          </div>
        </div>

        {/* 2. Enrollment Rate */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Enrollment Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
            {enrollmentRate}%
          </div>
          <div className="text-[11px] text-rose-500 font-medium mt-0.5">
            {patientsBehindTarget > 0 ? `${patientsBehindTarget} Patients Behind Target` : 'On target'}
          </div>
        </div>

        {/* 3. Active Sites */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Active sites</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {activeSites}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-0.5">
            {sitesNeedAttention} Sites Need Attention
          </div>
        </div>

        {/* 4. Time Remaining */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Time Remaining</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {timeRemainingText.split(' ')[0]} {timeRemainingText.split(' ')[1] || 'mths'}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {daysRemaining} Days To End Of Study
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Trend Chart & Site Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnrollmentTrendChart
            data={project.monthlyTrend && project.monthlyTrend.length > 0 ? project.monthlyTrend : undefined}
            title="Monthly Enrollment Trend"
            subtitle={`Actual vs target for ${project.id}`}
          />
        </div>
        <div className="lg:col-span-1">
          <SitePreviewList
            sites={project.sites || []}
            onSeeAll={() => onNavigateToSites(project.id)}
          />
        </div>
      </div>
    </div>
  );
};
