import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { Container } from './Container';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-gray-900">
              <span className="text-[var(--color-brand)]">Paper</span>Trail
            </span>
          </div>

          {/* Search Bar (Placeholder for global search) */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] sm:text-sm"
                placeholder="Search studies, sites, patients..."
                readOnly
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500 bg-red-50 rounded-full">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5 text-red-500" />
              <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center translate-x-1 -translate-y-1">
                12
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User className="h-5 w-5" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                JOHN HENRY
              </span>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};
