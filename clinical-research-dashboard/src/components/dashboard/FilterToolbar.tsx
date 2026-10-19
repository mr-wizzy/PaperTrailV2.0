import { useState, useEffect, type FC, type ChangeEvent } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { StatusFilter, AreaFilter } from '../../types/project';

export interface FilterToolbarProps {
  searchTerm: string;
  statusFilter: StatusFilter;
  areaFilter: AreaFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: StatusFilter) => void;
  onAreaChange: (area: AreaFilter) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: StatusFilter[] = [
  'All Statuses',
  'Active',
  'Recruiting',
  'Completed',
  'Suspended',
];

const AREA_OPTIONS: AreaFilter[] = [
  'All Areas',
  'Oncology',
  'Cardiology',
  'Neurology',
  'Immunology',
];

export const FilterToolbar: FC<FilterToolbarProps> = ({
  searchTerm,
  statusFilter,
  areaFilter,
  onSearchChange,
  onStatusChange,
  onAreaChange,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState<string>(searchTerm);

  // Synchronize local input state if parent resets or changes searchTerm externally
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  // Debounce user search input by 150ms as specified in PRD
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchTerm) {
        onSearchChange(localSearch);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchTerm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const isFiltered =
    searchTerm.trim() !== '' ||
    statusFilter !== 'All Statuses' ||
    areaFilter !== 'All Areas';

  return (
    <div
      role="search"
      aria-label="Filter studies"
      className="card-panel bg-white p-4 sm:p-5 mb-6 border border-gray-200/80 rounded-xl shadow-xs"
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            id="filter-search-input"
            type="text"
            value={localSearch}
            onChange={handleInputChange}
            placeholder="Search by title, protocol, or PI..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Status Filter Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="filter-status-select" className="sr-only">
              Filter by Status
            </label>
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
              className="w-full min-h-[44px] px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Therapeutic Area Filter Dropdown */}
          <div className="w-full sm:w-48">
            <label htmlFor="filter-area-select" className="sr-only">
              Filter by Therapeutic Area
            </label>
            <select
              id="filter-area-select"
              value={areaFilter}
              onChange={(e) => onAreaChange(e.target.value as AreaFilter)}
              className="w-full min-h-[44px] px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors cursor-pointer"
            >
              {AREA_OPTIONS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              id="filter-reset-button"
              type="button"
              onClick={onReset}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300/80 rounded-lg transition-colors cursor-pointer w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 text-gray-500" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
