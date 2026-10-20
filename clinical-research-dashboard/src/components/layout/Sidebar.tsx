import type { FC } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  FileBarChart,
  TrendingUp,
  Settings,
  X,
} from 'lucide-react';

export type NavItemKey = 'dashboard' | 'studies' | 'sites' | 'reports' | 'analytics' | 'settings';

export interface SidebarProps {
  activeNav: NavItemKey;
  onNavigate: (nav: NavItemKey) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  key: NavItemKey;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { key: 'studies', label: 'STUDIES', icon: FolderKanban },
  { key: 'sites', label: 'SITE HEALTH', icon: Activity },
  { key: 'reports', label: 'REPORTS', icon: FileBarChart },
  { key: 'analytics', label: 'ANALYTICS', icon: TrendingUp },
  { key: 'settings', label: 'SETTINGS', icon: Settings },
];

export const Sidebar: FC<SidebarProps> = ({
  activeNav,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile & Tablet Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200/90 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Paper<span className="text-blue-600 font-extrabold italic">Trail</span>
            </span>
          </div>

          {/* Close button for mobile and tablet drawer */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onNavigate(item.key);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full min-h-[44px] flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Quick View / Meta */}
        <div className="p-4 border-t border-gray-100 hidden lg:block">
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
              Registry Environment
            </span>
            <span className="text-xs font-medium text-slate-700">
              Production • v2.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
