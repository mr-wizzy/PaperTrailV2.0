import type { FC } from 'react';
import type { RiskLevel } from '../../types/project';

export interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
  variant?: 'pill' | 'text';
}

const RISK_PILL_STYLES: Record<RiskLevel, string> = {
  Critical: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
  High: 'bg-amber-50 text-amber-700 border-amber-200',
  Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const RISK_TEXT_STYLES: Record<RiskLevel, string> = {
  Critical: 'text-rose-600 font-bold',
  High: 'text-rose-600 font-semibold',
  Medium: 'text-amber-600 font-semibold',
  Low: 'text-emerald-600 font-semibold',
};

export const RiskBadge: FC<RiskBadgeProps> = ({ risk, className = '', variant = 'pill' }) => {
  if (variant === 'text') {
    return (
      <span className={`text-xs uppercase tracking-wider ${RISK_TEXT_STYLES[risk] || 'text-gray-600'} ${className}`}>
        {risk}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${
        RISK_PILL_STYLES[risk] || 'bg-gray-50 text-gray-700 border-gray-200'
      } ${className}`}
    >
      {risk}
    </span>
  );
};
