import type { FC } from 'react';
import { ArrowLeft, Calendar, User, Activity, ShieldCheck, Target } from 'lucide-react';
import type { ClinicalProject } from '../../types/project';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { EmptyState } from '../common/EmptyState';

export interface ProjectDetailViewProps {
  project: ClinicalProject | null | undefined;
  onBack: () => void;
}

export const ProjectDetailView: FC<ProjectDetailViewProps> = ({ project, onBack }) => {
  if (!project) {
    return (
      <EmptyState
        type="not-found"
        onBackToDashboard={onBack}
      />
    );
  }

  return (
    <article className="space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          id="btn-back-to-dashboard"
          className="min-h-[44px] inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Header Panel */}
      <header className="card-panel bg-white p-6 sm:p-8 border border-gray-200/80 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                {project.protocolNumber || 'N/A'}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                {project.phase || 'N/A'}
              </span>
              <StatusBadge status={project.status} />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {project.title || 'Untitled Project'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-1">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" aria-hidden="true" />
                <span>
                  Principal Investigator:{' '}
                  <strong className="font-medium text-gray-900">
                    {project.principalInvestigator || 'N/A'}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Two-Column Responsive Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Metadata */}
        <section
          aria-labelledby="section-metadata-heading"
          className="lg:col-span-1 space-y-6"
        >
          <div className="card-panel bg-white p-6 border border-gray-200/80 rounded-xl shadow-xs space-y-5">
            <h2 id="section-metadata-heading" className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span>Core Study Metadata</span>
            </h2>

            {/* Therapeutic Area */}
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                Therapeutic Area
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                {project.therapeuticArea || 'N/A'}
              </span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-2 border-t border-gray-100">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                  <span>Start Date</span>
                </span>
                <span className="text-sm font-semibold text-gray-900 font-mono">
                  {project.startDate || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                  <span>Last Updated</span>
                </span>
                <span className="text-sm font-semibold text-gray-900 font-mono">
                  {project.lastUpdated || 'N/A'}
                </span>
              </div>
            </div>

            {/* Enrollment Details */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">
                Enrollment Metrics
              </span>
              <ProgressBar
                current={project.enrollment?.current || 0}
                target={project.enrollment?.target || 0}
              />
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>Current: <strong className="text-gray-800">{project.enrollment?.current?.toLocaleString() || 0}</strong></span>
                <span>Target: <strong className="text-gray-800">{project.enrollment?.target?.toLocaleString() || 0}</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Study Content */}
        <section
          aria-labelledby="section-content-heading"
          className="lg:col-span-2 space-y-6"
        >
          {/* Study Description */}
          <div className="card-panel bg-white p-6 sm:p-7 border border-gray-200/80 rounded-xl shadow-xs space-y-3">
            <h2 id="section-content-heading" className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span>Study Protocol Description</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {project.description || 'No detailed description provided for this study protocol.'}
            </p>
          </div>

          {/* Primary Endpoint Callout */}
          <div className="card-panel bg-blue-50/50 p-6 sm:p-7 border border-blue-200/80 rounded-xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
              <Target className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span>Primary Endpoint</span>
            </div>
            <p className="text-base sm:text-lg font-medium text-blue-950 leading-snug">
              {project.primaryEndpoint || 'N/A'}
            </p>
          </div>
        </section>
      </div>
    </article>
  );
};
