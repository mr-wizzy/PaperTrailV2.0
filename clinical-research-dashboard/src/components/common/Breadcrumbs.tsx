import type { FC } from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-gray-500 font-medium ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.active;

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden="true" />
              )}
              {isLast || !item.onClick ? (
                <span className={isLast ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-gray-500 hover:underline"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
