import { useState, useMemo, useCallback, type FC } from 'react';
import type { ClinicalProject, StatusFilter, AreaFilter } from '../../types/project';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StudiesMetricRibbon } from './StudiesMetricRibbon';
import { FilterToolbar } from '../dashboard/FilterToolbar';
import { StudiesTable } from './StudiesTable';
import { StudyCard } from './StudyCard';
import { EmptyState } from '../common/EmptyState';
import { Plus } from 'lucide-react';

export interface StudiesDirectoryProps {
  projects: ClinicalProject[];
  onSelectStudy: (id: string) => void;
  onNavigateHome: () => void;
}

export const StudiesDirectory: FC<StudiesDirectoryProps> = ({
  projects,
  onSelectStudy,
  onNavigateHome,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Statuses');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('All Areas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setAreaFilter('All Areas');
  }, []);

  const handleNewStudyClick = () => {
    setToastMessage('New Study registration modal is restricted in read-only audit mode.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compound filter evaluation
  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const title = (project.title || '').toLowerCase();
      const protocol = (project.protocolNumber || '').toLowerCase();
      const id = (project.id || '').toLowerCase();
      const pi = (project.principalInvestigator || '').toLowerCase();
      const rm = (project.researchManager || '').toLowerCase();

      const matchesSearch =
        term === '' ||
        title.includes(term) ||
        protocol.includes(term) ||
        id.includes(term) ||
        pi.includes(term) ||
        rm.includes(term);

      const matchesStatus =
        statusFilter === 'All Statuses' || project.status === statusFilter;

      const matchesArea =
        areaFilter === 'All Areas' || project.therapeuticArea === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [projects, searchTerm, statusFilter, areaFilter]);

  const totalPatients = useMemo(() => {
    const enrolled = projects.reduce((sum, p) => sum + (p.enrollment?.current || 0), 0);
    const target = projects.reduce((sum, p) => sum + (p.enrollment?.target || 0), 0);
    return { enrolled, target };
  }, [projects]);

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
          { label: 'Studies', active: true },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            All Studies
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {projects.length} studies - {totalPatients.enrolled.toLocaleString()} of{' '}
            {totalPatients.target.toLocaleString()} patients enrolled
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewStudyClick}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New study</span>
        </button>
      </div>

      {/* Metric Ribbon */}
      <StudiesMetricRibbon projects={projects} />

      {/* Controls Toolbar */}
      <FilterToolbar
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        areaFilter={areaFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onAreaChange={setAreaFilter}
        onReset={handleResetFilters}
      />

      {/* Directory Table / Card Stack */}
      {filteredProjects.length === 0 ? (
        <EmptyState type="no-filter-results" onReset={handleResetFilters} />
      ) : (
        <div className="space-y-4">
          <div className="card-panel bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden hidden md:block">
            <StudiesTable
              projects={filteredProjects}
              onSelectStudy={onSelectStudy}
            />
          </div>

          <div className="block md:hidden space-y-3">
            {filteredProjects.map((project) => (
              <StudyCard
                key={project.id}
                project={project}
                onSelectStudy={onSelectStudy}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
