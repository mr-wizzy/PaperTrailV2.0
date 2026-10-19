import { useState, type FC } from 'react';
import {
  FileText,
  Printer,
  Download,
  ArrowLeft,
  Users,
  TrendingDown,
  Building2,
  AlertTriangle,
  BookmarkCheck,
} from 'lucide-react';
import type { ClinicalProject } from '../../types/project';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { KeyFindingCard } from './KeyFindingCard';
import { ProtocolMetricsCard } from './ProtocolMetricsCard';
import { EmptyState } from '../common/EmptyState';

export interface StudyReportViewProps {
  project: ClinicalProject | null | undefined;
  onNavigateHome: () => void;
  onNavigateToStudies: () => void;
  onNavigateToStudyOverview: (studyId: string) => void;
}

export const StudyReportView: FC<StudyReportViewProps> = ({
  project,
  onNavigateHome,
  onNavigateToStudies,
  onNavigateToStudyOverview,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!project) {
    return (
      <EmptyState
        type="not-found"
        onBackToDashboard={onNavigateHome}
      />
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    setToastMessage('Exporting clinical monitoring report to PDF...');
    setTimeout(() => {
      window.print();
      setToastMessage(null);
    }, 800);
  };

  const currentEnrollment = project.enrollment?.current || 450;
  const targetEnrollment = project.enrollment?.target || 1500;
  const enrollmentRate = Math.round((currentEnrollment / targetEnrollment) * 100);

  const sitesAtRisk = project.metrics?.sitesAtRisk || 4;
  const totalSitesCount = project.metrics?.sitesCount || project.sites?.length || 20;
  const openIssues = project.metrics?.openIssuesCount || 3;
  const keyFindings = project.keyFindings || [];
  const reg = project.regulatory;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg border border-gray-700">
          {toastMessage}
        </div>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onNavigateHome },
          { label: 'Studies', onClick: onNavigateToStudies },
          { label: project.id, onClick: () => onNavigateToStudyOverview(project.id) },
          { label: 'Report & Export', active: true },
        ]}
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 uppercase">
            Study Report and Export
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 uppercase font-medium tracking-tight">
            {project.title} || GENERATED APRIL 23, 2026
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 print:hidden">
          <button
            type="button"
            onClick={() => onNavigateToStudyOverview(project.id)}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <span>Study overview</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export pdf</span>
          </button>
        </div>
      </div>

      {/* Confidential Dark Banner */}
      <div className="card-panel bg-[#0d1e3d] text-white p-6 sm:p-7 border border-[#162f5f] rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <BookmarkCheck className="w-6 h-6" />
          </div>

          <div className="space-y-1.5 flex-1">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest block">
              CLINICAL RESEARCH REPORT || CONFIDENTIAL
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              {project.title}
            </h2>
            <p className="text-xs text-blue-100 font-medium">
              Protocol: <span className="font-mono text-white">{project.protocolNumber}</span>
              <span className="mx-2 text-blue-300">|</span>
              Sponsor: <span className="text-white">{project.sponsor || 'Federal Government'}</span>
            </p>
          </div>
        </div>

        {/* Metadata sub-grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/10 text-xs">
          <div>
            <span className="text-blue-300/80 text-[11px] block font-medium">Reporting Period</span>
            <span className="text-white font-semibold">{reg?.reportingPeriod || 'Jan 2026 - Apr 2026'}</span>
          </div>

          <div>
            <span className="text-blue-300/80 text-[11px] block font-medium">Status</span>
            <span className="text-white font-semibold uppercase">{project.status}</span>
          </div>

          <div>
            <span className="text-blue-300/80 text-[11px] block font-medium">Report Date</span>
            <span className="text-white font-semibold">{reg?.reportDate || 'January 15, 2026'}</span>
          </div>

          <div>
            <span className="text-blue-300/80 text-[11px] block font-medium">Prepared By</span>
            <span className="text-white font-semibold truncate block">
              {reg?.preparedBy || 'Dr Chinonso Egemma (Research monitor)'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
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

        {/* 2. Overall Rate */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Overall Rate</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
            35%
          </div>
          <div className="text-[11px] text-rose-500 font-medium mt-0.5">
            Vs 65% Expected Rate
          </div>
        </div>

        {/* 3. Sites at risk */}
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

        {/* 4. Open Issues */}
        <div className="card-panel bg-white p-5 border border-gray-200/80 rounded-xl shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xs font-bold uppercase tracking-wider text-gray-500">Open Issues</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            {openIssues}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Across 2 Sites
          </div>
        </div>
      </div>

      {/* 2-Column Body: Key Findings & Protocol Metrics Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Key Findings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Key Findings</h2>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              {keyFindings.length} Findings Identified
            </span>
          </div>

          <div className="space-y-3.5">
            {keyFindings.map((finding) => (
              <KeyFindingCard key={finding.id} finding={finding} />
            ))}
          </div>
        </div>

        {/* Right Column: Protocol & Study Metrics Sidebar Card */}
        <div className="lg:col-span-1">
          <ProtocolMetricsCard project={project} />
        </div>
      </div>
    </div>
  );
};
