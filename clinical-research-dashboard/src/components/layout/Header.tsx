import type { FC } from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

export interface HeaderProps {
  onOpenMobileMenu?: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export const Header: FC<HeaderProps> = ({
  onOpenMobileMenu,
  searchTerm = '',
  onSearchChange,
}) => {
  return (
    <header className="bg-white border-b border-gray-200/90 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile & Tablet Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden flex items-center">
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Paper<span className="text-blue-600 font-extrabold italic">Trail</span>
              </span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search studies, sites, patients..."
                className="w-full min-h-[42px] pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200/90 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right Action Icons (Notifications & Profile) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                aria-label="View notifications: 12 unread"
              >
                <Bell className="w-5 h-5 text-red-500" />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-white">
                  12
                </span>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200/80">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs" aria-hidden="true">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="hidden md:block text-xs font-bold tracking-wide text-gray-800">
                JOHN HENRY
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
