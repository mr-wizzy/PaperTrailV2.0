import { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar, type NavItemKey } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { StudiesDirectory } from './components/studies/StudiesDirectory';
import { StudyOverview } from './components/details/StudyOverview';
import { SitePerformanceView } from './components/sites/SitePerformanceView';
import { StudyReportView } from './components/reports/StudyReportView';
import type { ClinicalProject } from './types/project';
import rawProjects from './data/projects.json';

const initialProjects = rawProjects as ClinicalProject[];

type ViewMode = 'dashboard' | 'studies' | 'study' | 'sites' | 'report';

function App() {
  const [projects, setProjects] = useState<ClinicalProject[]>(initialProjects);
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [selectedStudyId, setSelectedStudyId] = useState<string | null>('COVID-2022');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Selected study record
  const selectedProject = useMemo(() => {
    const id = selectedStudyId || 'COVID-2022';
    return projects.find((p) => p.id === id) || projects[0] || null;
  }, [projects, selectedStudyId]);

  // Synchronized Navigation Function
  const navigateTo = useCallback((view: ViewMode, id?: string) => {
    setActiveView(view);
    const targetId = id || selectedStudyId || 'COVID-2022';
    setSelectedStudyId(targetId);

    const params = new URLSearchParams();
    params.set('view', view);
    if (view === 'study' || view === 'sites' || view === 'report') {
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

  // Handler to register a new study in active session state
  const handleAddStudy = useCallback(
    (newProject: ClinicalProject) => {
      setProjects((prev) => [newProject, ...prev]);
      setSelectedStudyId(newProject.id);
      navigateTo('study', newProject.id);
    },
    [navigateTo]
  );

  // URL state synchronizer (runs on mount and on popstate)
  useEffect(() => {
    const syncStateFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = (params.get('view') as ViewMode) || 'dashboard';
      const idParam = params.get('id') || params.get('project');

      if (idParam && projects.some((p) => p.id === idParam)) {
        setSelectedStudyId(idParam);
      } else {
        setSelectedStudyId('COVID-2022');
      }

      if (['dashboard', 'studies', 'study', 'sites', 'report'].includes(viewParam)) {
        setActiveView(viewParam);
      } else {
        setActiveView('dashboard');
      }
    };

    syncStateFromUrl();

    window.addEventListener('popstate', syncStateFromUrl);
    return () => {
      window.removeEventListener('popstate', syncStateFromUrl);
    };
  }, [projects]);

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

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchTerm={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* SCREEN 1: Executive Dashboard (dash_board.jpg) */}
          {activeView === 'dashboard' && (
            <ExecutiveDashboard
              projects={projects}
              onNavigateToStudies={() => navigateTo('studies')}
              onSelectStudy={(id) => navigateTo('study', id)}
            />
          )}

          {/* SCREEN 2: All Studies Directory (studies list.jpg) */}
          {activeView === 'studies' && (
            <StudiesDirectory
              projects={projects}
              onSelectStudy={(id) => navigateTo('study', id)}
              onNavigateHome={() => navigateTo('dashboard')}
              onAddStudy={handleAddStudy}
            />
          )}

          {/* SCREEN 3: Study Command Center (studies-specific.jpg) */}
          {activeView === 'study' && (
            <StudyOverview
              project={selectedProject}
              onNavigateHome={() => navigateTo('dashboard')}
              onNavigateToStudies={() => navigateTo('studies')}
              onNavigateToSites={(id) => navigateTo('sites', id)}
              onNavigateToReport={(id) => navigateTo('report', id)}
            />
          )}

          {/* SCREEN 4: Site Performance Details (Research Site performance.jpg) */}
          {activeView === 'sites' && (
            <SitePerformanceView
              project={selectedProject}
              onNavigateHome={() => navigateTo('dashboard')}
              onNavigateToStudies={() => navigateTo('studies')}
              onNavigateToStudyOverview={(id) => navigateTo('study', id)}
              onNavigateToReport={(id) => navigateTo('report', id)}
            />
          )}

          {/* SCREEN 5: Study Report & Export (REPORT.jpg) */}
          {activeView === 'report' && (
            <StudyReportView
              project={selectedProject}
              onNavigateHome={() => navigateTo('dashboard')}
              onNavigateToStudies={() => navigateTo('studies')}
              onNavigateToStudyOverview={(id) => navigateTo('study', id)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
