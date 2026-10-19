import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Container } from './components/layout/Container';
import { MetricRibbon } from './components/dashboard/MetricRibbon';
import { FilterToolbar } from './components/dashboard/FilterToolbar';
import { ProjectTable } from './components/dashboard/ProjectTable';
import { ProjectCard } from './components/dashboard/ProjectCard';
import { ProjectDetailView } from './components/details/ProjectDetailView';
import { EmptyState } from './components/common/EmptyState';
import type { ClinicalProject, StatusFilter, AreaFilter } from './types/project';
import rawProjects from './data/projects.json';

const projects = rawProjects as ClinicalProject[];

function App() {
  const [activeView, setActiveView] = useState<"dashboard" | "details">("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All Statuses");
  const [areaFilter, setAreaFilter] = useState<AreaFilter>("All Areas");

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("All Statuses");
    setAreaFilter("All Areas");
  }, []);

  // Derived filtered state using compound boolean logic
  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const title = (project.title || "").toLowerCase();
      const protocol = (project.protocolNumber || "").toLowerCase();
      const pi = (project.principalInvestigator || "").toLowerCase();

      const matchesSearch =
        term === "" ||
        title.includes(term) ||
        protocol.includes(term) ||
        pi.includes(term);

      const matchesStatus =
        statusFilter === "All Statuses" || project.status === statusFilter;

      const matchesArea =
        areaFilter === "All Areas" || project.therapeuticArea === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [searchTerm, statusFilter, areaFilter]);

  // Selected project for details view
  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId]);

  // Transition to details view and update URL search param
  const handleSelectProject = useCallback((id: string) => {
    setSelectedProjectId(id);
    setActiveView("details");
    const newUrl = `${window.location.pathname}?project=${encodeURIComponent(id)}`;
    window.history.pushState({ projectId: id }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Transition back to dashboard view and clear URL search param
  const handleBackToDashboard = useCallback(() => {
    setSelectedProjectId(null);
    setActiveView("dashboard");
    window.history.pushState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // URL synchronizer and back/forward browser history listener
  useEffect(() => {
    const syncStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const projectId = params.get('project');
      if (projectId) {
        const found = projects.some((p) => p.id === projectId);
        if (found) {
          setSelectedProjectId(projectId);
          setActiveView("details");
          return;
        }
      }
      setSelectedProjectId(null);
      setActiveView("dashboard");
    };

    syncStateFromUrl();

    window.addEventListener('popstate', syncStateFromUrl);
    return () => {
      window.removeEventListener('popstate', syncStateFromUrl);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app,#eff3f9)]">
      <Header />
      
      <main className="flex-1 py-8">
        <Container>
          {activeView === "dashboard" ? (
            <div>
              {/* Dashboard Title & Meta */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Research Overview</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {projects.length} clinical studies tracked across all phases
                  </p>
                </div>
              </div>

              {/* Step 3: Metric Summary Ribbon */}
              <MetricRibbon projects={projects} />

              {/* Step 4: Controls / Filter Toolbar */}
              <FilterToolbar
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                areaFilter={areaFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onAreaChange={setAreaFilter}
                onReset={handleResetFilters}
              />

              {/* Step 5: Data Presentation */}
              {projects.length === 0 ? (
                <EmptyState type="zero-global-data" />
              ) : filteredProjects.length === 0 ? (
                <EmptyState
                  type="no-filter-results"
                  onReset={handleResetFilters}
                />
              ) : (
                <div className="space-y-4">
                  {/* Results count indicator */}
                  <div className="flex items-center justify-between text-xs font-medium text-gray-500 px-1">
                    <span>
                      Showing <strong className="text-gray-900">{filteredProjects.length}</strong> of {projects.length} studies
                    </span>
                  </div>

                  {/* Desktop Table View */}
                  <div className="card-panel bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden hidden md:block">
                    <ProjectTable
                      projects={filteredProjects}
                      onSelectProject={handleSelectProject}
                    />
                  </div>

                  {/* Mobile Stacked Card View */}
                  <div className="block md:hidden space-y-3">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onSelectProject={handleSelectProject}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ProjectDetailView
              project={selectedProject}
              onBack={handleBackToDashboard}
            />
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;
