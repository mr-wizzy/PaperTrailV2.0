import { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar, type NavItemKey } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ProjectTable } from './components/dashboard/ProjectTable';
import { ProjectCard } from './components/dashboard/ProjectCard';
import { FilterToolbar } from './components/dashboard/FilterToolbar';
import { ProjectDetailView } from './components/details/ProjectDetailView';
import { EmptyState } from './components/common/EmptyState';
import type { ClinicalProject, StatusFilter, AreaFilter } from './types/project';
import rawProjects from './data/projects.json';

const projects = rawProjects as ClinicalProject[];

type ViewMode = 'dashboard' | 'studies' | 'study' | 'sites' | 'report';

function App() {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Search & Filter State (for Studies directory)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Statuses');
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('All Areas');

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setAreaFilter('All Areas');
  }, []);

  // Derived filtered projects for studies view
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
  }, [searchTerm, statusFilter, areaFilter]);

  // Selected study record
  const selectedProject = useMemo(() => {
    if (!selectedStudyId) return null;
    return projects.find((p) => p.id === selectedStudyId) || null;
  }, [selectedStudyId]);

  // Synchronized Navigation Function
  const navigateTo = useCallback((view: ViewMode, id?: string) => {
    setActiveView(view);
    const targetId = id || (view === 'study' || view === 'sites' || view === 'report' ? selectedStudyId : null);
    setSelectedStudyId(targetId);

    const params = new URLSearchParams();
    params.set('view', view);
    if (targetId) {
      params.set('id', targetId);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ view, id: targetId }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedStudyId]);

  // Sidebar navigation handler
  const handleSidebarNav = useCallback((nav: NavItemKey) => {
    if (nav === 'dashboard') {
      navigateTo('dashboard');
    } else if (nav === 'studies') {
      navigateTo('studies');
    } else if (nav === 'sites') {
      navigateTo('sites', selectedStudyId || 'COVID-2022');
    } else if (nav === 'reports') {
      navigateTo('report', selectedStudyId || 'COVID-2022');
    } else {
      navigateTo('dashboard');
    }
  }, [navigateTo, selectedStudyId]);

  // Select study action
  const handleSelectStudy = useCallback((id: string) => {
    navigateTo('study', id);
  }, [navigateTo]);

  // Sync state with browser URL search parameters and popstate
  useEffect(() => {
    const syncStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = (params.get('view') as ViewMode) || 'dashboard';
      const idParam = params.get('id') || params.get('project');

      if (idParam && projects.some((p) => p.id === idParam)) {
        setSelectedStudyId(idParam);
        if (viewParam === 'study' || viewParam === 'sites' || viewParam === 'report') {
          setActiveView(viewParam);
          return;
        }
      }

      if (viewParam === 'studies') {
        setActiveView('studies');
      } else {
        setActiveView('dashboard');
        setSelectedStudyId(null);
      }
    };

    syncStateFromUrl();

    window.addEventListener('popstate', syncStateFromUrl);
    return () => {
      window.removeEventListener('popstate', syncStateFromUrl);
    };
  }, []);

  // Map activeView to sidebar key
  const activeSidebarKey: NavItemKey =
    activeView === 'dashboard'
      ? 'dashboard'
      : activeView === 'studies'
      ? 'studies'
      : activeView === 'sites'
      ? 'sites'
      : activeView === 'report'
      ? 'reports'
      : 'studies';

  return (
    <div className="min-h-screen flex bg-[#f0f4f8]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeNav={activeSidebarKey}
        onNavigate={handleSidebarNav}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* SCREEN 1: Executive Dashboard */}
          {activeView === 'dashboard' && (
            <ExecutiveDashboard
              projects={projects}
              onNavigateToStudies={() => navigateTo('studies')}
              onSelectStudy={handleSelectStudy}
            />
          )}

          {/* SCREEN 2: All Studies Directory */}
          {activeView === 'studies' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">All Studies</h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {projects.length} studies - 1,200 of 4,500 patients enrolled
                  </p>
                </div>
              </div>

              {/* Filter Toolbar */}
              <FilterToolbar
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                areaFilter={areaFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onAreaChange={setAreaFilter}
                onReset={handleResetFilters}
              />

              {/* Data Presentation */}
              {filteredProjects.length === 0 ? (
                <EmptyState type="no-filter-results" onReset={handleResetFilters} />
              ) : (
                <div className="space-y-4">
                  <div className="card-panel bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden hidden md:block">
                    <ProjectTable
                      projects={filteredProjects}
                      onSelectProject={handleSelectStudy}
                    />
                  </div>

                  <div className="block md:hidden space-y-3">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onSelectProject={handleSelectStudy}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 3: Study Detail View */}
          {activeView === 'study' && (
            <ProjectDetailView
              project={selectedProject}
              onBack={() => navigateTo('dashboard')}
            />
          )}

          {/* Fallback for other contextual views */}
          {(activeView === 'sites' || activeView === 'report') && (
            <div className="card-panel bg-white p-8 border border-gray-200/80 rounded-xl shadow-xs text-center">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {activeView === 'sites' ? 'Site Performance Details' : 'Study Report & Export'}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Selected Study: {selectedStudyId || 'COVID-2022'}
              </p>
              <button
                type="button"
                onClick={() => navigateTo('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
